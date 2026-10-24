// Supabase Edge Function. Se invoca desde pg_cron con un secreto compartido.
// Los destinatarios salen de la lista «adviento» (adviento_pendientes) y cada aviso lleva su enlace de baja.
import { esc, FROM, sendEmail, SITE, SUPABASE_URL, unsubscribeLinks } from '../_shared/comun.ts';

const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const RESEND_KEY = Deno.env.get('RESEND_API_KEY') || '';
const DRY_RUN = Deno.env.get('RESEND_DRY_RUN') === '1';
const CRON_SECRET = Deno.env.get('ADVIENTO_CRON_SECRET') || '';

function json(data:unknown,status=200){return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}});}
async function db(path:string,body?:unknown,method='POST'){
  const response=await fetch(`${SUPABASE_URL}/rest/v1/${path}`,{method,headers:{apikey:SERVICE_KEY,Authorization:`Bearer ${SERVICE_KEY}`,'Content-Type':'application/json',Prefer:'return=representation'},body:body===undefined?undefined:JSON.stringify(body)});
  const data=await response.json().catch(()=>null);
  if(!response.ok)throw new Error(`Base de datos ${response.status}: ${data?.message||'sin detalle'}`);
  return data;
}
type Recipient={user_id:string;email:string;nombre:string;baja_token:string};
type Day={dia:number;titulo:string};
async function sendOne(person:Recipient,day:Day){
  const reserved=await db('rpc/adviento_reservar_correo',{p_user_id:person.user_id,p_dia:day.dia});
  if(!reserved)return 'omitido';
  const firstName=person.nombre.trim().split(/\s+/)[0]||'';
  const unsubscribe=unsubscribeLinks(person.baja_token,'adviento');
  const subject=`Día ${day.dia}: ${day.titulo} | Adviento IA`;
  const text=`Hola${firstName?`, ${firstName}`:''}.\n\nLa puerta ${day.dia} ya está abierta: ${day.titulo}.\n\nEntra a tu calendario: ${SITE}/adviento\n\nPara dejar de recibir estos avisos: ${unsubscribe.page}`;
  const html=`<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#3b252d"><p style="color:#691b32;font-weight:bold">carla lópez</p><h1 style="font-size:28px;color:#691b32">Hoy se abre el día ${day.dia}</h1><p>Hola${firstName?`, ${esc(firstName)}`:''}. Ya puedes descubrir <strong>${esc(day.titulo)}</strong>.</p><p>Es un reto breve para probar la IA a tu ritmo.</p><p><a href="${SITE}/adviento" style="display:inline-block;background:#691b32;color:white;padding:13px 20px;border-radius:8px;text-decoration:none">Abrir mi calendario</a></p><p style="font-size:12px;color:#6b5960">Si no quieres más avisos diarios, <a href="${unsubscribe.page}">date de baja aquí</a>.</p></div>`;
  try{
    const id=await sendEmail({to:person.email,subject,html,text,headers:unsubscribe.headers},`adviento-2026-${day.dia}-${person.user_id}`);
    await db(`adviento_correos?user_id=eq.${person.user_id}&dia=eq.${day.dia}`,{estado:'enviado',enviado_en:new Date().toISOString(),actualizado_en:new Date().toISOString(),resend_id:id||null,ultimo_error:null},'PATCH');
    return 'enviado';
  }catch(error){
    const reason=String(error).slice(0,500);
    await db(`adviento_correos?user_id=eq.${person.user_id}&dia=eq.${day.dia}`,{estado:'fallido',actualizado_en:new Date().toISOString(),ultimo_error:reason},'PATCH').catch(()=>{});
    return 'fallido';
  }
}

Deno.serve(async request=>{
  if(request.method!=='POST')return json({error:'Método no permitido'},405);
  if(!CRON_SECRET||request.headers.get('authorization')!==`Bearer ${CRON_SECRET}`)return json({error:'No autorizado'},401);
  if(!SUPABASE_URL||!SERVICE_KEY||(!RESEND_KEY&&!DRY_RUN))return json({error:'Faltan secretos del envío'},503);
  const local=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',hourCycle:'h23'}).formatToParts(new Date());
  const value=(part:string)=>local.find(p=>p.type===part)?.value||'';
  const year=Number(value('year')),month=Number(value('month')),dayNumber=Number(value('day')),hour=Number(value('hour'));
  if(year!==2026||month!==12||dayNumber<1||dayNumber>24||hour<8||hour>9)return json({skipped:'Fuera de la franja del Adviento 2026',remitente:FROM});
  try{
    const days:Day[]=await db(`adviento_dias?select=dia,titulo&dia=eq.${dayNumber}`,undefined,'GET');
    if(days.length!==1)return json({error:'Falta el día en la base de datos'},500);
    const recipients:Recipient[]=await db('rpc/adviento_pendientes',{p_dia:dayNumber});
    const results:string[]=[];
    for(const person of recipients){
      results.push(await sendOne(person,days[0]));
      await new Promise(resolve=>setTimeout(resolve,550));
    }
    return json({dia:dayNumber,pendientes:recipients.length,enviados:results.filter(r=>r==='enviado').length,fallidos:results.filter(r=>r==='fallido').length});
  }catch(error){return json({error:String(error)},500);}
});
