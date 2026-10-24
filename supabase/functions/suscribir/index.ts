// POST /api/suscribir — única entrada de altas en la newsletter (formulario general y guías).
// Responde siempre lo mismo, exista o no el correo, para no revelar quién está suscrito.
import { allowed, clientIp, cors, EMAIL_RE, GUIAS, json, rpc, serviceEmail, sendEmail, signLink, SITE } from '../_shared/comun.ts';

const LINK_DAYS = 7;

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response(null, { status:204, headers:cors(request) });
  if (request.method !== 'POST') return json(request, { error:'Método no permitido' }, 405);
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') return json(request, { error:'Petición no válida' }, 400);

  /* trampa anti-bots: el campo oculto solo lo rellenan los robots */
  if (body.empresa_web) return json(request, { ok:true });

  const email = String(body.email || '').trim().toLowerCase();
  const nombre = String(body.nombre || '').trim().slice(0, 80);
  const origen = String(body.origen || 'web');
  const version = String(body.version || '');
  const guia = body.guia ? GUIAS.find(g => g.slug === body.guia) : null;
  if (!EMAIL_RE.test(email) || email.length > 254) return json(request, { error:'Revisa tu correo electrónico.' }, 400);
  if (body.consentimiento !== true) return json(request, { error:'Necesito tu consentimiento para poder escribirte.' }, 400);
  if (body.lista !== 'newsletter' || !/^[a-z0-9:-]{1,60}$/.test(origen) || !/^[0-9-]{10}$/.test(version) || (body.guia && !guia)) {
    return json(request, { error:'Petición no válida' }, 400);
  }

  try {
    if (!await allowed(`suscribir:ip:${clientIp(request)}`, 20, 3600)) return json(request, { error:'Demasiados intentos. Prueba dentro de un rato.' }, 429);
    /* red de seguridad si alguien falsifica la IP llamando directamente a la función */
    if (!await allowed('suscribir:global', 300, 3600)) return json(request, { error:'Demasiados intentos. Prueba dentro de un rato.' }, 429);
    /* por correo: sin mensaje distinto, para que nadie pueda saturar el buzón de otra persona ni averiguar nada */
    if (!await allowed(`suscribir:email:${email}`, 3, 3600)) return json(request, { ok:true });

    const [row] = await rpc<{ suscriptor_id:string; confirmado:boolean }[]>('suscripcion_alta', {
      p_email:email, p_nombre:nombre || null, p_lista:'newsletter', p_version:version, p_origen:origen, p_confirmado:false
    });
    const expires = Math.floor(Date.now() / 1000) + LINK_DAYS * 86400;

    if (guia) {
      /* el mismo correo entrega la guía y confirma la suscripción al descargarla */
      const { d, s } = await signLink({ s:row.suscriptor_id, l:'newsletter', g:guia.slug, e:expires });
      const url = `${SITE}/guias/descargar?d=${d}&s=${s}`;
      const mail = serviceEmail({
        title:`Tu guía: ${guia.titulo}`,
        intro:`${nombre ? `Hola, ${nombre}. ` : ''}Aquí tienes tu guía. Al descargarla confirmas también tu suscripción a la newsletter semanal, un correo cada domingo con ideas de IA para tu trabajo.`,
        button:'Descargar la guía',
        url,
        note:`El enlace caduca en ${LINK_DAYS} días. Si no has pedido esta guía, ignora este correo: no te enviaré nada más.`
      });
      await sendEmail({ to:email, subject:`Tu guía: ${guia.titulo}`, ...mail });
    } else if (!row.confirmado) {
      const { d, s } = await signLink({ s:row.suscriptor_id, l:'newsletter', e:expires });
      const url = `${SITE}/newsletter/confirmar?d=${d}&s=${s}`;
      const mail = serviceEmail({
        title:'Confirma tu suscripción',
        intro:`${nombre ? `Hola, ${nombre}. ` : ''}Pulsa el botón para empezar a recibir la newsletter semanal: un correo cada domingo con una noticia de IA, una idea y un prompt listo para copiar.`,
        button:'Confirmar mi suscripción',
        url,
        note:`El enlace caduca en ${LINK_DAYS} días. Si no te has apuntado tú, ignora este correo: no recibirás nada más.`
      });
      await sendEmail({ to:email, subject:'Confirma tu suscripción a la newsletter', ...mail });
    }
    return json(request, { ok:true });
  } catch (error) {
    console.error(error);
    return json(request, { error:'No se ha podido completar. Inténtalo de nuevo en unos minutos.' }, 500);
  }
});
