// api/webhook.js
//
// Serverless function (Vercel, runtime Node). Recebe a notificação que o
// Mercado Pago manda para `notification_url` (configurado em
// api/checkout.js) sempre que o status de um pagamento muda — aprovado,
// recusado, pendente, etc.
//
// O que este arquivo faz hoje:
//   1. Identifica o ID do pagamento notificado (aceita tanto o formato
//      novo — POST com corpo JSON — quanto o formato legado de IPN, que
//      pode chegar como GET com query string).
//   2. Busca os detalhes reais do pagamento na API do Mercado Pago (nunca
//      confia em nada que não seja o `id` vindo da notificação — status,
//      valor etc. sempre vêm de uma chamada nossa de volta pra eles).
//   3. Registra o resultado no log (visível em Vercel → Project → Logs).
//
// O que este arquivo AINDA NÃO faz, por não termos banco de dados: marcar
// o pedido como pago em algum lugar persistente, disparar e-mail de
// confirmação, ou avisar a Naara automaticamente. Por enquanto, o log
// estruturado abaixo *é* a fonte de verdade — é nele que dá pra conferir,
// pedido por pedido, se o pagamento foi aprovado. Ver README para o
// roteiro de teste e os próximos passos de persistência.
//
// Hardening opcional (não implementado): o Mercado Pago pode assinar as
// notificações com um segredo configurável no painel deles, enviado no
// header `x-signature`. Sem uma variável de ambiente pra esse segredo,
// não validamos a assinatura — qualquer POST bem formado é aceito e a
// gente confia no que a API deles devolve para aquele `id`. Isso é seguro
// o bastante porque nunca confiamos em status/valor vindo da notificação
// em si, só no que a própria API do Mercado Pago confirma de volta.

import { readJsonBody } from './_lib.js';

const MP_PAYMENTS_URL = 'https://api.mercadopago.com/v1/payments';

function extractNotification(req, body) {
  // Formato novo (recomendado): POST com corpo JSON.
  if (body?.data?.id) {
    return { type: body.type ?? body.topic ?? null, paymentId: String(body.data.id) };
  }
  // Formato legado (IPN): geralmente GET com query string.
  const q = req.query ?? {};
  const type = q.type ?? q.topic ?? null;
  const paymentId = q['data.id'] ?? q.id ?? null;
  return { type, paymentId: paymentId ? String(paymentId) : null };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST' && req.method !== 'GET') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    console.error('[webhook] MERCADOPAGO_ACCESS_TOKEN não configurado.');
    return res.status(500).json({ error: 'Webhook indisponível no momento.' });
  }

  const body = readJsonBody(req);
  const { type, paymentId } = extractNotification(req, body);

  // Eventos que não são de pagamento (ex.: merchant_order) não interessam
  // aqui — confirma recebimento e não faz nada.
  if (type && type !== 'payment') {
    console.log('[webhook] Notificação ignorada (tipo não é payment):', type);
    return res.status(200).json({ received: true, ignored: true });
  }

  if (!paymentId) {
    console.warn('[webhook] Notificação sem id de pagamento — provável teste de conectividade.');
    return res.status(200).json({ received: true });
  }

  try {
    const mpRes = await fetch(`${MP_PAYMENTS_URL}/${paymentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (mpRes.status === 404) {
      // Acontece com o botão "simular" do painel do Mercado Pago, que
      // manda um id fictício só pra testar se a URL responde.
      console.log('[webhook] Pagamento não encontrado (provável simulação):', paymentId);
      return res.status(200).json({ received: true, found: false });
    }

    const payment = await mpRes.json().catch(() => null);

    if (!mpRes.ok || !payment) {
      console.error('[webhook] Falha ao buscar o pagamento no Mercado Pago:', mpRes.status, payment);
      // 502 faz o Mercado Pago tentar de novo mais tarde — correto aqui,
      // porque pode ter sido uma instabilidade passageira do lado deles.
      return res.status(502).json({ error: 'Falha ao consultar o pagamento.' });
    }

    // ── Fonte de verdade do pedido, por enquanto: este log ──
    console.log('[webhook] Pagamento notificado:', JSON.stringify({
      payment_id: payment.id,
      status: payment.status,
      status_detail: payment.status_detail,
      transaction_amount: payment.transaction_amount,
      external_reference: payment.external_reference,
      destination_cep: payment.metadata?.destination_cep,
      shipping_service: payment.metadata?.shipping_service,
      shipping_company: payment.metadata?.shipping_company,
      payer_email: payment.payer?.email,
      date_approved: payment.date_approved,
    }));

    return res.status(200).json({ received: true, status: payment.status });
  } catch (err) {
    console.error('[webhook] Erro inesperado ao processar notificação:', err);
    return res.status(502).json({ error: 'Falha ao processar notificação.' });
  }
}
