// Envía el número aprobado de la newsletter. La lanza pg_cron cada 10 minutos con un secreto compartido.
// · Solo sale un número con estado 'aprobado' y programado_para vencido; sin fecha no sale nunca.
// · El HTML y el texto se envían tal cual: solo se sustituye {{baja_url}} por el enlace personal de baja.
// · Si se interrumpe, la siguiente ejecución continúa donde se quedó sin repetir envíos.
// · { "prueba": true, "numero": N } envía ese número solo a PRUEBA_EMAIL, sin registrar nada.
import { rpc, sendBatch, sendEmail, SITE, SUPABASE_URL, unsubscribeLinks } from '../_shared/comun.ts';

const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const CRON_SECRET = Deno.env.get('NEWSLETTER_CRON_SECRET') || '';
const TEST_EMAIL = Deno.env.get('PRUEBA_EMAIL') || 'hola@carla-lopez.com';
const MARKER = '{{baja_url}}';
const BATCH = 100;
const TIME_BUDGET_MS = 100_000;

type Numero = { id:string; numero:number; asunto:string; html:string; texto:string };
type Destinatario = { suscriptor_id:string; email:string; nombre:string; baja_token:string };

function json(data:unknown, status = 200) { return new Response(JSON.stringify(data), { status, headers:{ 'Content-Type':'application/json' } }); }
const fill = (template:string, url:string) => template.split(MARKER).join(url);

async function rest(path:string, method = 'GET', body?:unknown) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method, headers:{ apikey:SERVICE_KEY, Authorization:`Bearer ${SERVICE_KEY}`, 'Content-Type':'application/json', Prefer:'return=representation' },
    body:body === undefined ? undefined : JSON.stringify(body)
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`Base de datos ${response.status}: ${data?.message || 'sin detalle'}`);
  return data;
}

Deno.serve(async request => {
  if (request.method !== 'POST') return json({ error:'Método no permitido' }, 405);
  if (!CRON_SECRET || request.headers.get('authorization') !== `Bearer ${CRON_SECRET}`) return json({ error:'No autorizado' }, 401);
  const body = await request.json().catch(() => ({}));
  const started = Date.now();

  try {
    if (body?.prueba) {
      const [numero]:Numero[] = await rest(`newsletter_numeros?select=id,numero,asunto,html,texto&numero=eq.${Number(body.numero)}`);
      if (!numero) return json({ error:'No existe ese número' }, 404);
      const links = unsubscribeLinks('00000000-0000-0000-0000-000000000000', 'newsletter');
      const id = await sendEmail({ to:TEST_EMAIL, subject:`[Prueba] ${numero.asunto}`, html:fill(numero.html, links.page), text:fill(numero.texto, links.page), headers:links.headers });
      return json({ prueba:true, numero:numero.numero, para:TEST_EMAIL, resend_id:id });
    }

    const [numero]:Numero[] = await rpc('newsletter_siguiente_numero', {});
    if (!numero) return json({ nada:'No hay ningún número aprobado con fecha vencida' });
    /* sin enlace de baja no se envía: vuelve a borrador para que Carla lo revise */
    if (!numero.html.includes(MARKER) || !numero.texto.includes(MARKER)) {
      await rest(`newsletter_numeros?id=eq.${numero.id}`, 'PATCH', { estado:'borrador' });
      return json({ error:`El número ${numero.numero} no tiene ${MARKER} en el HTML o en el texto. Ha vuelto a borrador.` }, 422);
    }

    let enviados = 0, errores = 0;
    while (Date.now() - started < TIME_BUDGET_MS) {
      const lote:Destinatario[] = await rpc('newsletter_reservar_lote', { p_numero:numero.id, p_limite:BATCH });
      if (!lote.length) break;
      const emails = lote.map(person => {
        const links = unsubscribeLinks(person.baja_token, 'newsletter');
        return { to:person.email, subject:numero.asunto, html:fill(numero.html, links.page), text:fill(numero.texto, links.page), headers:links.headers };
      });
      let resultados;
      try {
        const ids = await sendBatch(emails, `newsletter-${numero.id}-${lote.map(p => p.suscriptor_id).join(',').slice(0, 200)}`);
        resultados = lote.map((person, i) => ({ suscriptor_id:person.suscriptor_id, estado:'enviado', resend_id:ids[i] || null, error:null }));
        enviados += lote.length;
      } catch (error) {
        resultados = lote.map(person => ({ suscriptor_id:person.suscriptor_id, estado:'error', resend_id:null, error:String(error).slice(0, 500) }));
        errores += lote.length;
      }
      await rpc('newsletter_guardar_resultados', { p_numero:numero.id, p_resultados:resultados });
      await new Promise(resolve => setTimeout(resolve, 600));
    }
    const cerrado = await rpc<boolean>('newsletter_cerrar', { p_numero:numero.id });
    return json({ numero:numero.numero, enviados, errores, cerrado, web:SITE });
  } catch (error) {
    console.error(error);
    return json({ error:String(error) }, 500);
  }
});
