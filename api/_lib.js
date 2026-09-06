// api/_lib.js
//
// Helpers pequenos, compartilhados entre as serverless functions
// (checkout.js, frete.js e, no futuro, webhook.js). Nada específico de
// Mercado Pago ou Melhor Envio mora aqui — só utilitário de HTTP puro.

export function getOrigin(req) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `${proto}://${host}`;
}

export function readJsonBody(req) {
  // Vercel geralmente já entrega req.body parseado quando o
  // Content-Type é application/json. Isso aqui é só uma rede de
  // segurança para quando ele chega como string (ex.: alguns
  // ambientes de teste locais) ou vazio.
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string' && req.body.length) {
    try { return JSON.parse(req.body); } catch { return null; }
  }
  return null;
}

/** Mantém só dígitos e confere se sobraram exatamente 8 (formato de CEP). */
export function sanitizeCep(raw) {
  const digits = String(raw ?? '').replace(/\D/g, '');
  return digits.length === 8 ? digits : null;
}
