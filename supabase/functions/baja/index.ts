// POST /api/baja
// · Botón «Cancelar suscripción» de Gmail/Yahoo (RFC 8058): POST /api/baja?token=…&lista=… con el cuerpo
//   «List-Unsubscribe=One-Click». Responde 200 sin más.
// · Página /baja: JSON { token, lista: 'adviento'|'newsletter'|'todo', accion: 'baja'|'deshacer' }.
// Un GET no da de baja: los antivirus y las vistas previas abren los enlaces.
import { allowed, clientIp, cors, json, rpc, UUID_RE } from '../_shared/comun.ts';

const LISTAS = ['adviento', 'newsletter', 'todo'];

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response(null, { status:204, headers:cors(request) });
  if (request.method !== 'POST') return json(request, { error:'Método no permitido' }, 405);
  const url = new URL(request.url);
  const type = request.headers.get('content-type') || '';
  let token = '', lista = '', accion = 'baja', oneClick = false;
  if (type.includes('application/x-www-form-urlencoded') || type.includes('multipart/form-data') || url.searchParams.has('token')) {
    oneClick = true;
    token = url.searchParams.get('token') || '';
    lista = url.searchParams.get('lista') || '';
  } else {
    const body = await request.json().catch(() => ({}));
    token = String(body?.token || ''); lista = String(body?.lista || ''); accion = body?.accion === 'deshacer' ? 'deshacer' : 'baja';
  }
  if (!UUID_RE.test(token) || !LISTAS.includes(lista)) return json(request, { error:'Este enlace no es válido.' }, 400);

  try {
    /* la baja de un clic se atiende siempre; el límite solo frena a quien prueba tokens al azar */
    if (!oneClick && !await allowed(`baja:ip:${clientIp(request)}`, 120, 600)) return json(request, { error:'Demasiados intentos. Prueba dentro de un rato.' }, 429);
    const ok = await rpc<boolean>(accion === 'deshacer' ? 'suscripcion_deshacer_baja' : 'suscripcion_baja', { p_token:token, p_lista:lista });
    if (oneClick) return new Response('ok', { status:200, headers:cors(request) });
    return ok ? json(request, { ok:true }) : json(request, { error:'No encontramos esta suscripción. Usa el enlace de tu último correo.' }, 404);
  } catch (error) {
    console.error(error);
    return json(request, { error:'No se ha podido procesar. Inténtalo de nuevo en unos minutos.' }, 500);
  }
});
