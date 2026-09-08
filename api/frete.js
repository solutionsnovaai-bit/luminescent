// api/frete.js
//
// Serverless function (Vercel, runtime Node). Recebe os itens da sacola +
// o CEP de destino, monta UM pacote (a caixa da Naara, com a altura
// escalando pela quantidade de velas) e cota esse pacote no Melhor Envio,
// devolvendo as opções reais de frete (transportadora, serviço, preço e
// prazo) para o front-end mostrar no carrinho.
//
// A lógica de cotação mora em `quoteShipping()`, exportada aqui e
// reaproveitada por api/checkout.js — que a chama de novo no momento de
// pagar, pra revalidar o frete escolhido antes de confiar no preço (nunca
// confiar em número vindo do navegador, mesmo que já tenha vindo por uma
// resposta nossa antes).
//
// Regras de empacotamento (confirmadas com a Naara):
//   • 550g fixos por vela, não importa qual aroma — peso do pedido é
//     550g × quantidade total de velas.
//   • Caixa única de 17,5 × 11,5 cm (comprimento × largura), fixos.
//   • A altura escala com a quantidade: 9 cm por vela empilhada
//     (1 vela = 9cm, 2 velas = 18cm, 3 velas = 27cm, ...).
//
// Como o empacotamento já é definido por nós (não pelo algoritmo de
// empacotamento do Melhor Envio), usamos a rota de "cotação por pacotes"
// (`volumes`), passando a caixa já pronta, em vez da rota "por produtos"
// (que faria o Melhor Envio decidir como empacotar).
//
// Requer a variável de ambiente MELHORENVIO_TOKEN (token pessoal de
// acesso, com o escopo "shipping-calculate", gerado na conta Melhor Envio
// da Naara). Nunca é exposta ao navegador.

import { PRODUCTS } from '../src/data/store.js';
import { readJsonBody, sanitizeCep } from './_lib.js';

// ── Config do envio — únicos números que mudam se a Naara trocar de caixa ──
const ORIGIN_POSTAL_CODE = '03679050'; // CEP de origem, sem traço
const BOX_LENGTH_CM = 17.5; // comprimento — fixo, não escala
const BOX_WIDTH_CM = 11.5; // largura — fixo, não escala
const HEIGHT_PER_CANDLE_CM = 9; // altura por vela — escala com a quantidade
const WEIGHT_PER_CANDLE_KG = 0.55; // 550g por vela (a API do Melhor Envio usa kg)

const MAX_QTY_PER_ITEM = 20;

const round = (n, decimals) => Number(n.toFixed(decimals));

/**
 * Erro com `.status` HTTP anexado, pra quem chama decidir como responder
 * (o handler HTTP local mapeia direto; api/checkout.js decide o dele).
 */
export class ShippingError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/**
 * Cota o frete de verdade no Melhor Envio para os itens informados.
 *
 * @param {{ to: string, items: Array<{id: string, qty: number}> }} input
 * @returns {Promise<{ options: Array, box: object }>}
 * @throws {ShippingError} em qualquer validação ou falha da API externa.
 */
export async function quoteShipping({ to, items }) {
  const accessToken = process.env.MELHORENVIO_TOKEN;
  if (!accessToken) {
    console.error('[frete] MELHORENVIO_TOKEN não configurado.');
    throw new ShippingError(500, 'Cálculo de frete indisponível no momento.');
  }

  const destinationCep = sanitizeCep(to);
  if (!destinationCep) {
    throw new ShippingError(400, 'CEP de destino inválido.');
  }

  const rawItems = Array.isArray(items) ? items : [];
  if (!rawItems.length) {
    throw new ShippingError(400, 'Sacola vazia.');
  }

  // ── Revalida cada item contra o catálogo real do servidor ──
  // (mesma lógica de segurança do /api/checkout.js: nunca confiar em
  // quantidade/id vindo do navegador sem checar contra o que existe.)
  let totalQty = 0;
  let merchandiseValue = 0;
  for (const raw of rawItems) {
    const product = PRODUCTS.find((p) => p.id === raw?.id);
    if (!product) {
      throw new ShippingError(400, `Produto inválido: ${raw?.id ?? '(sem id)'}`);
    }
    const qty = Math.min(MAX_QTY_PER_ITEM, Math.max(1, Math.round(Number(raw.qty) || 1)));
    totalQty += qty;
    merchandiseValue += qty * product.price;
  }

  // ── Monta a caixa única, já com a altura escalada ──
  const volume = {
    height: round(HEIGHT_PER_CANDLE_CM * totalQty, 1),
    width: BOX_WIDTH_CM,
    length: BOX_LENGTH_CM,
    weight: round(WEIGHT_PER_CANDLE_KG * totalQty, 3),
    insurance: round(merchandiseValue, 2),
  };

  const payload = {
    from: { postal_code: ORIGIN_POSTAL_CODE },
    to: { postal_code: destinationCep },
    volumes: [volume],
    options: { receipt: false, own_hand: false },
  };

  // Lidos aqui dentro (não como constante de módulo) para respeitar a
  // variável de ambiente em cada chamada, do mesmo jeito que o token acima.
  const meBaseUrl =
    process.env.MELHORENVIO_SANDBOX === 'true'
      ? 'https://sandbox.melhorenvio.com.br'
      : 'https://www.melhorenvio.com.br';
  const meCalculateUrl = `${meBaseUrl}/api/v2/me/shipment/calculate`;
  const userAgent =
    process.env.MELHORENVIO_USER_AGENT || 'Luminescent - loja de velas (site oficial)';

  let meRes, data;
  try {
    meRes = await fetch(meCalculateUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': userAgent,
      },
      body: JSON.stringify(payload),
    });
    data = await meRes.json().catch(() => null);
  } catch (err) {
    console.error('[frete] Falha ao chamar o Melhor Envio:', err);
    throw new ShippingError(502, 'Não foi possível calcular o frete agora.');
  }

  if (!meRes.ok || !Array.isArray(data)) {
    console.error('[frete] Melhor Envio recusou a cotação:', meRes.status, data);
    throw new ShippingError(502, 'Não foi possível calcular o frete agora.');
  }

  // Serviços sem cotação pra essa rota/pacote vêm com `error` preenchido
  // em vez de preço (ex.: transportadora não atende a região, ou o
  // pacote excede o limite dela) — esses são descartados aqui.
  const options = data
    .filter((q) => !q.error && (q.custom_price ?? q.price))
    .map((q) => ({
      id: q.id,
      service: q.name,
      company: q.company?.name ?? '',
      price: round(Number(q.custom_price ?? q.price), 2),
      deliveryDays: q.custom_delivery_time ?? q.delivery_time ?? null,
    }))
    .sort((a, b) => a.price - b.price);

  return { options, box: volume };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const body = readJsonBody(req);

  try {
    const result = await quoteShipping({ to: body?.to, items: body?.items });
    return res.status(200).json(result);
  } catch (err) {
    if (err instanceof ShippingError) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error('[frete] Erro inesperado:', err);
    return res.status(500).json({ error: 'Não foi possível calcular o frete agora.' });
  }
}
