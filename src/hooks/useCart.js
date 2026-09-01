import { useCallback, useEffect, useMemo, useState } from 'react';
import { PRODUCTS, brl, waLink } from '../data/store';

const KEY = 'luminescent:cart';

/** Sacola local. Persiste no navegador e monta o pedido para o WhatsApp. */
export default function useCart() {
  const [items, setItems] = useState({});
  const [open, setOpen] = useState(false);

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
  const total = useMemo(() => lines.reduce((a, l) => a + l.qty * l.price, 0), [lines]);

  const checkoutUrl = useMemo(() => {
    if (!lines.length) return waLink('Olá Naara! Vim pelo site e gostaria de fazer um pedido.');
    const body = lines
      .map((l) => `• ${l.qty}x ${l.name} (${l.weight}) — ${brl(l.qty * l.price)}`)
      .join('\n');
    return waLink(
      `Olá Naara! Gostaria de fazer este pedido:\n\n${body}\n\nTotal: ${brl(total)}\n\nPode me passar o frete?`
    );
  }, [lines, total]);

  return { items, lines, count, total, add, dec, remove, clear, open, setOpen, checkoutUrl };
}
