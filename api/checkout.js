// api/checkout.js
//
// Serverless function (Vercel, runtime Node). Recebe os itens da sacola +
// o frete escolhido pelo cliente, RECALCULA tudo a partir do servidor —
// nunca confia em preço vindo do navegador, nem no de produto nem no de
// frete — e cria uma preferência de pagamento no Mercado Pago (Checkout
// Pro). Devolve `init_point`, a URL pra onde o front-end redireciona o
// cliente.
//
// Requer a variável de ambiente MERCADOPAGO_ACCESS_TOKEN (Access Token de
// produção da aplicação "Loja Luminescent"). Nunca é exposta ao navegador:
// só existe aqui, do lado do servidor.
//
// Frete: o cliente manda `to` (CEP) e `shippingOptionId` (o `id` de uma
// das opções que /api/frete.js já devolveu pra ele no carrinho). Este
// arquivo chama `quoteShipping()` de novo — a MESMA função que
// api/frete.js usa — e só aceita o frete se aquele id ainda aparecer na
// cotação fresca, usando o preço RECÉM-CALCULADO (nunca o que o
// navegador mandou) para montar a preferência.

import { PRODUCTS } from '../src/data/store.js';
import { getOrigin, readJsonBody } from './_lib.js';
import { quoteShipping, ShippingError } from './frete.js';

const MP_PREFERENCES_URL = 'https://api.mercadopago.com/checkout/preferences';
const MAX_QTY_PER_ITEM = 20;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    console.error('[checkout] MERCADOPAGO_ACCESS_TOKEN não configurado.');
    return res.status(500).json({ error: 'Checkout indisponível no momento.' });
  }

  const body = readJsonBody(req);
  const rawItems = Array.isArray(body?.items) ? body.items : [];
  if (!rawItems.length) {
    return res.status(400).json({ error: 'Sacola vazia.' });
  }

  const destinationCep = body?.to;
  const shippingOptionId = body?.shippingOptionId;
  if (!destinationCep || shippingOptionId === undefined || shippingOptionId === null) {
    return res.status(400).json({ error: 'Selecione um frete antes de continuar.' });
  }

  // ── Recalcula cada item a partir do catálogo real do servidor ──
  const mpItems = [];
  for (const raw of rawItems) {
    const product = PRODUCTS.find((p) => p.id === raw?.id);
    if (!product) {
      return res.status(400).json({ error: `Produto inválido: ${raw?.id ?? '(sem id)'}` });
    }
    const qty = Math.min(MAX_QTY_PER_ITEM, Math.max(1, Math.round(Number(raw.qty) || 1)));
    mpItems.push({
      id: product.id,
      title: `${product.name} (${product.weight})`,
      quantity: qty,
      unit_price: product.price,
      currency_id: 'BRL',
    });
  }

  // ── Revalida o frete: recota do zero e só aceita se o id escolhido
  //    ainda existir na cotação fresca. O preço usado é sempre o
  //    recém-calculado — o que o navegador mandou nunca é confiado. ──
  let shippingChoice;
  try {
    const { options } = await quoteShipping({ to: destinationCep, items: rawItems });
    shippingChoice = options.find((o) => String(o.id) === String(shippingOptionId));
    if (!shippingChoice) {
      return res.status(409).json({
        error: 'Esse frete não está mais disponível. Calcule novamente antes de continuar.',
      });
    }
  } catch (err) {
    if (err instanceof ShippingError) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error('[checkout] Falha ao revalidar o frete:', err);
    return res.status(502).json({ error: 'Não foi possível confirmar o frete agora.' });
  }

  // Aviso silencioso nos logs se o preço que o cliente via na tela já
  // estava desatualizado (ex.: tarifa do Melhor Envio mudou entre o
  // cálculo e o pagamento) — não bloqueia a compra, só ajuda a auditar.
  if (body?.shippingPrice !== undefined && Number(body.shippingPrice) !== shippingChoice.price) {
    console.warn(
      '[checkout] Preço de frete divergente do exibido ao cliente:',
      'exibido =', body.shippingPrice, '| recalculado =', shippingChoice.price
    );
  }

  mpItems.push({
    id: `frete-${shippingChoice.id}`,
    title: `Frete — ${shippingChoice.company} ${shippingChoice.service}`.trim(),
    quantity: 1,
    unit_price: shippingChoice.price,
    currency_id: 'BRL',
  });

  const origin = getOrigin(req);
  const isHttps = origin.startsWith('https://');
  const orderId = `lum_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const preference = {
    items: mpItems,
    external_reference: orderId,
    statement_descriptor: 'LUMINESCENT',
    back_urls: {
      success: `${origin}/?pedido=aprovado`,
      pending: `${origin}/?pedido=pendente`,
      failure: `${origin}/?pedido=recusado`,
    },
    // auto_return exige back_urls https — em desenvolvimento local (http)
    // isso é omitido para a preferência não ser rejeitada pelo Mercado Pago.
    ...(isHttps ? { auto_return: 'approved' } : {}),
    // Sem banco de dados ainda: guardamos aqui o essencial para conseguir
    // separar e enviar o pedido só olhando o pagamento no painel do
    // Mercado Pago (Detalhes → Metadata).
    metadata: {
      destination_cep: String(destinationCep).replace(/\D/g, ''),
      shipping_service: shippingChoice.service,
      shipping_company: shippingChoice.company,
    },
    notification_url: `${origin}/api/webhook`,
  };

  try {
    const mpRes = await fetch(MP_PREFERENCES_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': orderId,
      },
      body: JSON.stringify(preference),
    });

    const data = await mpRes.json().catch(() => null);

    if (!mpRes.ok || !data?.init_point) {
      console.error('[checkout] Mercado Pago recusou a preferência:', mpRes.status, data);
      return res.status(502).json({ error: 'Não foi possível iniciar o pagamento.' });
    }

    return res.status(200).json({ init_point: data.init_point, id: data.id, order_id: orderId });
  } catch (err) {
    console.error('[checkout] Falha ao chamar o Mercado Pago:', err);
    return res.status(502).json({ error: 'Não foi possível iniciar o pagamento.' });
  }
}
