// POST /api/resend-webhook — Resend avisa de rebotes y quejas. La firma (Svix) se comprueba antes de nada.
// Rebote permanente o queja: el envío se marca y la persona queda dada de baja de todas las listas.
import { json, rpc } from '../_shared/comun.ts';

const SECRET = Deno.env.get('RESEND_WEBHOOK_SECRET') || '';
const TOLERANCE_SECONDS = 300;

async function validSignature(request:Request, body:string) {
  const id = request.headers.get('svix-id') || '';
  const timestamp = request.headers.get('svix-timestamp') || '';
  const signatures = request.headers.get('svix-signature') || '';
  if (!SECRET.startsWith('whsec_') || !id || !timestamp || !signatures) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > TOLERANCE_SECONDS) return false;
  const secret = Uint8Array.from(atob(SECRET.slice('whsec_'.length)), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('raw', secret, { name:'HMAC', hash:'SHA-256' }, false, ['sign']);
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${id}.${timestamp}.${body}`));
  const expected = btoa(String.fromCharCode(...new Uint8Array(mac)));
  return signatures.split(' ').some(part => {
    const [version, signature] = part.split(',');
    if (version !== 'v1' || !signature || signature.length !== expected.length) return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
    return diff === 0;
  });
}

Deno.serve(async request => {
  if (request.method !== 'POST') return json(request, { error:'Método no permitido' }, 405);
  const body = await request.text();
  if (body.length > 100_000 || !await validSignature(request, body)) return json(request, { error:'Firma no válida' }, 401);
  try {
    const event = JSON.parse(body);
    const data = event?.data || {};
    let tipo:'rebotado'|'queja'|null = null;
    if (event?.type === 'email.complained') tipo = 'queja';
    /* los rebotes temporales (buzón lleno, servidor caído) no dan de baja */
    if (event?.type === 'email.bounced' && (!data.bounce?.type || data.bounce.type === 'Permanent')) tipo = 'rebotado';
    if (tipo) {
      const to = Array.isArray(data.to) ? data.to[0] : data.to;
      await rpc('correo_incidencia', { p_resend_id:data.email_id || null, p_email:to || null, p_tipo:tipo });
    }
    return json(request, { ok:true });
  } catch (error) {
    console.error(error);
    return json(request, { error:'Error procesando el aviso' }, 500);
  }
});
