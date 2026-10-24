// Piezas comunes de las Edge Functions de suscripciones, bajas y newsletter.
// Las claves secretas solo viven aquí, en variables de entorno de las funciones.
import guias from './guias.json' with { type: 'json' };

export const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const RESEND_KEY = Deno.env.get('RESEND_API_KEY') || '';
/* RESEND_DRY_RUN=1: no envía nada, solo lo registra (pruebas en local) */
const DRY_RUN = Deno.env.get('RESEND_DRY_RUN') === '1';
const LINKS_SECRET = Deno.env.get('ENLACES_SECRET') || '';
export const SITE = (Deno.env.get('SITE_URL') || 'https://www.carla-lopez.com').replace(/\/$/, '');
export const FROM = Deno.env.get('CORREO_REMITENTE') || 'Carla López <hola@carla-lopez.com>';
export const VERSION_POLITICA = '2026-10-24';

export type Guia = { slug:string; titulo:string; archivo:string; nombreDescarga:string; pagina:string };
export const GUIAS = guias as Guia[];

/* La web llama desde su propio dominio (reescritura de Vercel) o, en local, desde el servidor de Astro */
const ORIGINS = [SITE, 'https://carla-lopez.com', 'http://localhost:3000', 'http://127.0.0.1:3000'];
export function cors(request:Request):Record<string,string> {
  const origin = request.headers.get('origin') || '';
  return ORIGINS.includes(origin)
    ? { 'Access-Control-Allow-Origin':origin, 'Access-Control-Allow-Methods':'POST, OPTIONS', 'Access-Control-Allow-Headers':'content-type', Vary:'Origin' }
    : {};
}
export function json(request:Request, data:unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers:{ 'Content-Type':'application/json', 'Cache-Control':'no-store', ...cors(request) } });
}

export async function rpc<T = unknown>(name:string, args:Record<string, unknown>):Promise<T> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method:'POST',
    headers:{ apikey:SERVICE_KEY, Authorization:`Bearer ${SERVICE_KEY}`, 'Content-Type':'application/json' },
    body:JSON.stringify(args)
  });
  const raw = await response.text();
  const data = raw ? JSON.parse(raw) : null;
  if (!response.ok) throw new Error(`Base de datos ${response.status}: ${data?.message || 'sin detalle'}`);
  return data as T;
}

/* Límite de peticiones por clave (IP o correo). La IP la pone la red de Supabase o, detrás de Vercel, x-forwarded-for. */
export function clientIp(request:Request) {
  return (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'desconocida';
}
export async function allowed(key:string, max:number, seconds:number) {
  return await rpc<boolean>('permitir_peticion', { p_clave:key, p_max:max, p_segundos:seconds });
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/* ---------- enlaces firmados con caducidad (confirmar y descargar guías) ---------- */
const encoder = new TextEncoder();
const b64url = (bytes:Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const fromB64url = (text:string) => Uint8Array.from(atob(text.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
async function hmac(data:string) {
  if (LINKS_SECRET.length < 32) throw new Error('Falta ENLACES_SECRET');
  const key = await crypto.subtle.importKey('raw', encoder.encode(LINKS_SECRET), { name:'HMAC', hash:'SHA-256' }, false, ['sign']);
  return b64url(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(data))));
}
export type LinkData = { s:string; l:'newsletter'; g?:string; e:number };
export async function signLink(data:LinkData) {
  const d = b64url(encoder.encode(JSON.stringify(data)));
  return { d, s:await hmac(d) };
}
export async function verifyLink(d:string, s:string):Promise<LinkData|null> {
  if (typeof d !== 'string' || typeof s !== 'string' || d.length > 600) return null;
  const expected = await hmac(d);
  if (expected.length !== s.length) return null;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ s.charCodeAt(i);
  if (diff) return null;
  try {
    const data = JSON.parse(new TextDecoder().decode(fromB64url(d))) as LinkData;
    return data.e > Date.now() / 1000 && UUID_RE.test(data.s) ? data : null;
  } catch { return null; }
}

/* ---------- correo ---------- */
export type Email = { to:string; subject:string; html:string; text:string; headers?:Record<string,string> };
export async function sendEmail(email:Email, idempotencyKey?:string):Promise<string> {
  if (DRY_RUN) { console.log('[simulado]', JSON.stringify({ to:email.to, subject:email.subject, headers:email.headers, text:email.text })); return `simulado_${crypto.randomUUID()}`; }
  if (!RESEND_KEY) throw new Error('Falta RESEND_API_KEY');
  const response = await fetch('https://api.resend.com/emails', {
    method:'POST',
    headers:{ Authorization:`Bearer ${RESEND_KEY}`, 'Content-Type':'application/json', ...(idempotencyKey ? { 'Idempotency-Key':idempotencyKey } : {}) },
    body:JSON.stringify({ from:FROM, to:[email.to], subject:email.subject, html:email.html, text:email.text, headers:email.headers })
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Resend ${response.status}: ${result.message || 'sin detalle'}`);
  return result.id;
}
/* Envío por lotes (hasta 100 por llamada). Devuelve los id en el mismo orden. */
export async function sendBatch(emails:Email[], idempotencyKey:string):Promise<string[]> {
  if (DRY_RUN) { emails.forEach(e => console.log('[simulado lote]', JSON.stringify({ to:e.to, subject:e.subject, headers:e.headers }))); return emails.map(() => `simulado_${crypto.randomUUID()}`); }
  if (!RESEND_KEY) throw new Error('Falta RESEND_API_KEY');
  const response = await fetch('https://api.resend.com/emails/batch', {
    method:'POST',
    headers:{ Authorization:`Bearer ${RESEND_KEY}`, 'Content-Type':'application/json', 'Idempotency-Key':idempotencyKey },
    body:JSON.stringify(emails.map(e => ({ from:FROM, to:[e.to], subject:e.subject, html:e.html, text:e.text, headers:e.headers })))
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Resend ${response.status}: ${result.message || 'sin detalle'}`);
  return (result.data || []).map((item:{ id:string }) => item.id);
}

/* Enlace personal de baja y cabeceras para el botón «Cancelar suscripción» de Gmail y Yahoo */
export function unsubscribeLinks(token:string, list:'adviento'|'newsletter') {
  const query = `token=${encodeURIComponent(token)}&lista=${list}`;
  return {
    page:`${SITE}/baja?${query}`,
    headers:{ 'List-Unsubscribe':`<${SITE}/api/baja?${query}>`, 'List-Unsubscribe-Post':'List-Unsubscribe=One-Click' }
  };
}

/* Plantilla sobria para los correos de servicio (confirmación y guías), con la paleta de la newsletter */
export function esc(value:string) {
  return value.replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]!));
}
export function serviceEmail({ title, intro, button, url, note }:{ title:string; intro:string; button:string; url:string; note:string }) {
  const html = `<!doctype html><html lang="es"><body style="margin:0;background:#ffffff">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;font-family:'Inter Tight',Inter,Arial,sans-serif;color:#1D1D1F">
<tr><td style="padding-bottom:24px"><img src="${SITE}/assets/logo-mark.png" alt="" width="44" height="30" style="display:block;border:0"></td></tr>
<tr><td style="font-size:26px;line-height:1.2;font-weight:600;color:#691B32;padding-bottom:16px">${esc(title)}</td></tr>
<tr><td style="font-size:16px;line-height:1.55;padding-bottom:24px">${esc(intro)}</td></tr>
<tr><td style="padding-bottom:24px"><a href="${url}" style="display:inline-block;background:#691B32;color:#ffffff;text-decoration:none;font-weight:600;font-size:16px;padding:14px 24px;border-radius:8px">${esc(button)}</a></td></tr>
<tr><td style="font-size:13px;line-height:1.5;color:#6E6E73;padding-bottom:24px;border-bottom:1px solid #E8E8ED">${esc(note)}</td></tr>
<tr><td style="font-size:12px;line-height:1.5;color:#6E6E73;padding-top:16px">carla lópez · @carlaylz · <a href="${SITE}/privacidad" style="color:#6E6E73">Privacidad</a> · <a href="${SITE}/terminos" style="color:#6E6E73">Términos</a></td></tr>
</table></td></tr></table></body></html>`;
  const text = `${title}\n\n${intro}\n\n${button}: ${url}\n\n${note}\n\ncarla lópez · @carlaylz\nPrivacidad: ${SITE}/privacidad\nTérminos: ${SITE}/terminos`;
  return { html, text };
}
