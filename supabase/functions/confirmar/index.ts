// POST /api/confirmar — la página /newsletter/confirmar o /guias/descargar envía aquí el enlace firmado
// del correo. Se hace con un botón (POST) para que los antivirus que abren enlaces no confirmen por nadie.
import { allowed, clientIp, cors, GUIAS, json, rpc, SUPABASE_URL, verifyLink } from '../_shared/comun.ts';

const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
/* en local las funciones ven Supabase por la red interna de Docker; el navegador necesita la dirección pública */
const PUBLIC_URL = Deno.env.get('URL_PUBLICA_SUPABASE') || SUPABASE_URL;

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response(null, { status:204, headers:cors(request) });
  if (request.method !== 'POST') return json(request, { error:'Método no permitido' }, 405);
  const body = await request.json().catch(() => null);
  try {
    if (!await allowed(`confirmar:ip:${clientIp(request)}`, 60, 600)) return json(request, { error:'Demasiados intentos. Prueba dentro de un rato.' }, 429);
    const link = await verifyLink(body?.d, body?.s);
    if (!link) return json(request, { error:'Este enlace no es válido o ha caducado.' }, 400);

    await rpc('suscripcion_confirmar', { p_suscriptor:link.s, p_lista:'newsletter' });

    if (!link.g) return json(request, { ok:true });
    const guia = GUIAS.find(g => g.slug === link.g);
    if (!guia) return json(request, { error:'Esta guía ya no está disponible.' }, 404);
    /* URL firmada de Storage, válida 5 minutos: suficiente para la descarga y nada más */
    const response = await fetch(`${SUPABASE_URL}/storage/v1/object/sign/guias/${encodeURIComponent(guia.archivo)}`, {
      method:'POST',
      headers:{ apikey:SERVICE_KEY, Authorization:`Bearer ${SERVICE_KEY}`, 'Content-Type':'application/json' },
      body:JSON.stringify({ expiresIn:300 })
    });
    const signed = await response.json().catch(() => ({}));
    if (!response.ok || !signed.signedURL) throw new Error(`Storage ${response.status}: ${signed.message || 'sin URL'}`);
    const url = `${PUBLIC_URL}/storage/v1${signed.signedURL}&download=${encodeURIComponent(guia.nombreDescarga)}`;
    return json(request, { ok:true, url, titulo:guia.titulo });
  } catch (error) {
    console.error(error);
    return json(request, { error:'No se ha podido completar. Inténtalo de nuevo en unos minutos.' }, 500);
  }
});
