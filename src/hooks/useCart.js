import { useCallback, useEffect, useMemo, useState } from 'react';
import { PRODUCTS } from '../data/store';

const KEY = 'luminescent:cart';

/** Mantém só dígitos, formata como 00000-000 conforme a pessoa digita. */
function formatCep(value) {
  const digits = String(value ?? '').replace(/\D/g, '').slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

/** Formata telefone conforme digita: (11) 91234-5678 ou (11) 1234-5678. */
function formatPhone(value) {
  const digits = String(value ?? '').replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/**
 * Sacola local. Persiste no navegador e finaliza a compra via
 * /api/checkout.js (Mercado Pago Checkout Pro), com frete real calculado
 * via /api/frete.js (Melhor Envio).
 *
 * O CEP e o frete escolhido NÃO são persistidos entre sessões de
 * propósito: a caixa (peso/altura) depende da quantidade total de velas,
 * então qualquer mudança no carrinho invalida uma cotação anterior. É
 * mais seguro sempre recalcular do que arriscar mostrar um frete que já
 * não corresponde mais ao que está na sacola. Os dados de entrega
 * (nome, telefone, endereço) também não são persistidos — são só
 * repassados pro Mercado Pago no momento da compra.
 */
export default function useCart() {
  const [items, setItems] = useState({});
  const [open, setOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  const [cep, setCepRaw] = useState('');
  const [shippingOptions, setShippingOptions] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState(null);

  // ── dados de entrega — coletados no próprio site, nunca na tela do
  //    Mercado Pago, pra Naara sempre ter pra onde e pra quem enviar ──
  const [customerName, setCustomerName] = useState('');
  const [customerPhoneRaw, setCustomerPhoneRaw] = useState('');
  const [street, setStreet] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* primeiro acesso ou storage bloqueado */
    }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* ignora */ }
  }, [items]);

  const add = useCallback((id) => {
    setItems((s) => ({ ...s, [id]: (s[id] || 0) + 1 }));
    setOpen(true);
  }, []);

  const dec = useCallback((id) => {
    setItems((s) => {
      const n = (s[id] || 0) - 1;
      const next = { ...s };
      if (n <= 0) delete next[id]; else next[id] = n;
      return next;
    });
  }, []);

  const remove = useCallback((id) => {
    setItems((s) => { const next = { ...s }; delete next[id]; return next; });
  }, []);

  const clear = useCallback(() => setItems({}), []);

  const lines = useMemo(
    () =>
      Object.entries(items)
        .map(([id, qty]) => {
          const p = PRODUCTS.find((x) => x.id === id);
          return p ? { ...p, qty } : null;
        })
        .filter(Boolean),
    [items]
  );

  const count = useMemo(() => lines.reduce((a, l) => a + l.qty, 0), [lines]);
  const subtotal = useMemo(() => lines.reduce((a, l) => a + l.qty * l.price, 0), [lines]);
  const shipping = selectedShipping ? selectedShipping.price : 0;
  const total = subtotal + shipping;

  // Qualquer mudança na quantidade total de velas muda o peso/altura da
  // caixa — uma cotação de frete anterior deixa de valer. Reseta tudo
  // pra forçar recalcular (sem isso, dá pra "aproveitar" um frete mais
  // barato calculado com menos itens e depois adicionar mais na sacola).
  useEffect(() => {
    setShippingOptions(null);
    setSelectedShipping(null);
    setShippingError(null);
  }, [count]);

  const setCep = useCallback((value) => {
    setCepRaw(formatCep(value));
  }, []);

  const setCustomerPhone = useCallback((value) => {
    setCustomerPhoneRaw(formatPhone(value));
  }, []);

  const addressComplete = useMemo(() => (
    customerName.trim().length >= 3
    && customerPhoneRaw.replace(/\D/g, '').length >= 10
    && street.trim().length >= 2
    && streetNumber.trim().length >= 1
    && neighborhood.trim().length >= 2
  ), [customerName, customerPhoneRaw, street, streetNumber, neighborhood]);

  /**
   * Chama /api/frete.js com o CEP atual e os itens da sacola. Sempre
   * limpa a seleção anterior antes de calcular de novo — se o CEP mudou,
   * a opção escolhida antes pode nem existir mais na lista nova.
   */
  const calculateShipping = useCallback(async () => {
    const digits = cep.replace(/\D/g, '');
    if (digits.length !== 8) {
      setShippingError('Digite um CEP válido, com 8 números.');
      return;
    }
    if (!lines.length || shippingLoading) return;

    setShippingLoading(true);
    setShippingError(null);
    setShippingOptions(null);
    setSelectedShipping(null);

    try {
      const res = await fetch('/api/frete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: digits,
          items: lines.map((l) => ({ id: l.id, qty: l.qty })),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || 'Não foi possível calcular o frete.');
      }
      const options = Array.isArray(data?.options) ? data.options : [];
      setShippingOptions(options);
      if (!options.length) {
        setShippingError('Nenhuma transportadora disponível para esse CEP no momento.');
      }
    } catch (err) {
      setShippingError(
        err instanceof Error && err.message
          ? err.message
          : 'Não foi possível calcular o frete. Tente novamente em instantes.'
      );
    } finally {
      setShippingLoading(false);
    }
  }, [cep, lines, shippingLoading]);

  const selectShipping = useCallback((option) => {
    setSelectedShipping(option);
  }, []);

  /**
   * Chama /api/checkout.js, que valida os itens e o frete no servidor
   * (nunca confia no que vem do navegador) e cria a preferência no
   * Mercado Pago. Em caso de sucesso, redireciona para o checkout deles.
   */
  const startCheckout = useCallback(async () => {
    if (!lines.length || !selectedShipping || !addressComplete || checkingOut) return;
    setCheckingOut(true);
    setCheckoutError(null);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: lines.map((l) => ({ id: l.id, qty: l.qty })),
          to: cep.replace(/\D/g, ''),
          shippingOptionId: selectedShipping.id,
          shippingPrice: selectedShipping.price, // só para auditoria no log do servidor
          customerName: customerName.trim(),
          customerPhone: customerPhoneRaw.replace(/\D/g, ''),
          street: street.trim(),
          streetNumber: streetNumber.trim(),
          complement: complement.trim(),
          neighborhood: neighborhood.trim(),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.init_point) {
        throw new Error(data?.error || 'Não foi possível iniciar o pagamento.');
      }
      window.location.href = data.init_point;
    } catch (err) {
      setCheckoutError(
        err instanceof Error && err.message
          ? err.message
          : 'Não foi possível iniciar o pagamento. Tente novamente em instantes.'
      );
      setCheckingOut(false);
    }
  }, [lines, selectedShipping, addressComplete, cep, checkingOut, customerName, customerPhoneRaw, street, streetNumber, complement, neighborhood]);

  return {
    items, lines, count, subtotal, shipping, total,
    add, dec, remove, clear, open, setOpen,
    cep, setCep, shippingOptions, selectedShipping, shippingLoading, shippingError,
    calculateShipping, selectShipping,
    customerName, setCustomerName,
    customerPhone: customerPhoneRaw, setCustomerPhone,
    street, setStreet, streetNumber, setStreetNumber,
    complement, setComplement, neighborhood, setNeighborhood,
    addressComplete,
    startCheckout, checkingOut, checkoutError,
  };
}
