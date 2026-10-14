import { readFileSync } from 'node:fs';
import { fontFaces } from './adviento-pdf.mjs';

/*
 * Calendario imprimible del kit de arranque (regalo del día 1).
 * Página 1: los 24 días, con los mismos títulos, tipos, herramientas, tiempos e iconos que la web.
 * Página 2: la hoja del mapa de tareas, que se rellena el día 1 y se completa el día 24.
 * Se genera en cada `npm run build:adviento`, así que nunca se desincroniza del calendario.
 */
export const CALENDAR_VERSION = '1';

const sprite = readFileSync('public/assets/adviento-icons.svg', 'utf8').replace('<svg ', '<svg style="display:none" ');
const dayIcons = [...readFileSync('src/data/adviento-icons.ts', 'utf8').match(/const dayIcons = \[([\s\S]*?)\]/)[1].matchAll(/'([^']+)'/g)].map(m => m[1]);
const weekdays = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
/* 1 de diciembre de 2026 es martes. */
const weekday = day => weekdays[(day + 1) % 7];
const notes = { 8:'Festivo', 24:'Nochebuena' };
const esc = text => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/* En la casilla cabe la herramienta, no el detalle de la función. */
const shortTool = tool => tool.replace(/\s*\(.*\)/, '').replace(/ \+ (conector|para) .*/, '').replace(/ para comparar$/, '');
const typeClass = type => type.toLowerCase().includes('regalo') ? 'is-gift' : type === 'Reto' ? 'is-challenge' : type === 'Formación' ? 'is-class' : 'is-light';

const css = `${fontFaces}
@page{size:A4;margin:12mm 13mm}
*{box-sizing:border-box}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{margin:0;font:400 9pt/1.45 'Inter Tight',Arial,sans-serif;color:#3B252D}
.page{height:268mm;overflow:hidden;display:flex;flex-direction:column;break-after:page}
.page:last-child{break-after:auto}
.head{display:flex;justify-content:space-between;align-items:baseline;padding-bottom:7px;border-bottom:1px solid rgba(59,37,45,.14);font-size:8pt;color:#6B5960}
.head strong{color:#691B32;font-size:11pt;font-weight:600;letter-spacing:-.02em}
.eave{display:flex;justify-content:space-between;margin:9px 2px 0;font-size:8pt;line-height:1}
.eave span:nth-child(odd){color:#691B32}.eave span:nth-child(even){color:#F3C969}
.intro{display:flex;justify-content:space-between;align-items:flex-end;gap:10mm;margin:6mm 0 4.5mm}
h1{margin:0;color:#691B32;font-size:27pt;line-height:1.05;font-weight:600;letter-spacing:-.03em}
.lead{margin:6px 0 0;max-width:118mm;font-size:10pt;color:#6B5960}
.legend{flex:none;width:54mm;margin:0;padding:0;list-style:none;font-size:7.5pt;line-height:1.35;color:#6B5960}
.legend li{display:flex;gap:6px;align-items:baseline;margin:2.5px 0}
.legend b{flex:none;width:17mm}
.type{display:inline-block;white-space:nowrap;padding:1.5px 5px;border-radius:4px;font-size:6.5pt;font-weight:600;letter-spacing:.02em;text-transform:uppercase}
.is-challenge .type,.legend .is-challenge{background:#E9D4D9;color:#691B32}
.is-gift .type,.legend .is-gift{background:#F3C969;color:#521326}
.is-light .type,.legend .is-light{background:#F8F5ED;color:#6B5960;box-shadow:inset 0 0 0 1px rgba(59,37,45,.14)}
.is-class .type,.legend .is-class{background:#691B32;color:#fff}
.grid{flex:1;min-height:0;display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(6,1fr);gap:2.4mm}
.day{position:relative;display:flex;flex-direction:column;padding:3mm 3.2mm 2.6mm;border:1px solid rgba(59,37,45,.14);border-radius:3.5mm;background:#fff;break-inside:avoid}
.day.is-gift{border-color:#E7B957;background:#FFFBF0}
.day.last{border-color:#691B32;background:#FBF6F7}
.top{display:flex;align-items:center;gap:2mm}
.num{color:#691B32;font-size:17pt;font-weight:600;line-height:1;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.wd{font-weight:600;text-transform:capitalize}
.icon{width:4.6mm;height:4.6mm;margin-left:auto;color:#691B32}
.box{flex:none;width:4.6mm;height:4.6mm;border:1.4px solid #691B32;border-radius:1mm;background:#fff}
.title{margin:2.2mm 0 0;font-size:9.5pt;font-weight:600;line-height:1.22;color:#3B252D}
.meta{margin-top:auto;padding-top:1.6mm;font-size:7.5pt;color:#6B5960;white-space:nowrap}
.note{color:#691B32;font-weight:600}
.foot{display:flex;justify-content:space-between;align-items:flex-end;gap:10mm;margin-top:4mm;padding-top:3mm;border-top:1px solid rgba(59,37,45,.14);font-size:8pt;color:#6B5960}
.foot p{margin:0;max-width:130mm}
.foot strong{color:#3B252D}
.foot .site{color:#691B32;font-weight:600}
/* página 2 */
h2{margin:0 0 2mm;color:#691B32;font-size:13.5pt;line-height:1.2;font-weight:600;letter-spacing:-.01em}
.p2-intro{margin:5mm 0 5mm}
.p2-intro h1{font-size:24pt}
.p2-intro p{margin:5px 0 0;max-width:150mm;font-size:10pt;color:#6B5960}
section{margin-bottom:5mm}
section>p{margin:0 0 3mm;color:#6B5960}
table{width:100%;border-collapse:collapse}
th{padding:0 2mm 2mm 0;text-align:left;font-size:7pt;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:#6B5960;border-bottom:1px solid rgba(59,37,45,.22)}
td{height:11mm;border-bottom:1px solid rgba(59,37,45,.14)}
td.n{width:7mm;color:#691B32;font-weight:600;font-size:11pt}
th.later,td.later{background:#FBF6F7;padding-left:2.5mm}
.tag{display:inline-block;margin-left:4px;padding:1px 4px;border-radius:3px;background:#691B32;color:#fff;font-size:6pt;letter-spacing:.03em}
.line{height:9mm;border-bottom:1px solid rgba(59,37,45,.22)}
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm}
.card{padding:3.5mm 4mm;border:1px solid rgba(59,37,45,.14);border-radius:3.5mm;background:#fff}
.card h3{display:flex;align-items:center;gap:2mm;margin:0 0 1.5mm;font-size:9.5pt;font-weight:600}
.card p{margin:0;font-size:8pt;color:#6B5960}
.dot{width:3mm;height:3mm;border-radius:50%}
.two{display:grid;grid-template-columns:1.15fr 1fr;gap:3mm;margin-bottom:5mm}
.two .card{padding:4mm 4.5mm}
.two h3{font-size:11pt;color:#691B32;margin-bottom:1mm}
.two .sub{margin:0 0 2.5mm;font-size:8pt;color:#6B5960}
.checks{margin:0;padding:0;list-style:none;font-size:8.5pt}
.checks li{display:flex;gap:2.2mm;align-items:flex-start;margin:1.2mm 0}
.checks .box{width:3.6mm;height:3.6mm;margin-top:.4mm}
.rule{margin:3mm 0 0;padding-top:2.5mm;border-top:1px solid rgba(59,37,45,.14);font-size:8pt;color:#3B252D}
blockquote{margin:auto 0 0;padding:3.5mm 4.5mm;border-left:3px solid #F3C969;border-radius:0 3.5mm 3.5mm 0;background:#F8F5ED;font-size:9.5pt;line-height:1.45;color:#3B252D}
.two .card{display:flex;flex-direction:column}
.two .card .rule{margin-bottom:4mm}
`;

const head = right => `<div class="head"><strong>carla lópez</strong><span>${right}</span></div><div class="eave" aria-hidden="true">${'<span>✦</span><span>✧</span>'.repeat(24)}</div>`;

function dayCell(day) {
  const last = day.dia === 24 ? ' last' : '';
  return `<div class="day ${typeClass(day.tipo)}${last}">
    <div class="top"><span class="num">${day.dia}</span><span class="type">${esc(day.tipo)}</span><svg class="icon" viewBox="0 0 24 24"><use href="#${dayIcons[day.dia - 1]}"/></svg><span class="box"></span></div>
    <p class="title">${esc(day.titulo)}</p>
    <div class="meta"><span class="wd">${weekday(day.dia)}</span> · ${esc(shortTool(day.herramienta))} · ${day.minutos} min${notes[day.dia] ? ` · <span class="note">${notes[day.dia]}</span>` : ''}</div>
  </div>`;
}

/* Lo mismo que se marca el día 24 en «Mi mapa para 2027». */
const skills = ['Darle contexto para que responda como yo quiero', 'Montar un proyecto con mis documentos', 'Conectar el calendario o el correo', 'Programar una tarea que se ejecuta sola', 'Hacer una presentación desde datos', 'Preguntarle a mis documentos y comprobar las citas', 'Cruzar dos archivos y sacar un informe', 'Documentar un proceso que solo estaba en mi cabeza', 'Clasificar correo con mi propio criterio', 'Saber qué no conviene automatizar'];

export function calendarDocument(days) {
  const minMinutes = Math.min(...days.map(d => d.minutos)), maxMinutes = Math.max(...days.map(d => d.minutos));
  const page1 = `<div class="page">
    ${head('Calendario de Adviento IA · Diciembre 2026')}
    <div class="intro">
      <div><h1>24 días para perderle<br>el miedo a la IA</h1><p class="lead">Un reto al día, de ${minMinutes} a ${maxMinutes} minutos, con algo que puedas usar mañana en el trabajo. Marca la casilla cuando lo termines.</p></div>
      <ul class="legend">
        <li><b><span class="type is-challenge">Reto</span></b>Tarea guiada con resultado</li>
        <li><b><span class="type is-light">Tip</span></b>Una idea corta, sin deberes</li>
        <li><b><span class="type is-gift">Regalo</span></b>Plantilla para llevarte</li>
        <li><b><span class="type is-light">Sorpresa</span></b>Algo para jugar y descubrir</li>
        <li><b><span class="type is-class">Formación</span></b>Una mini-clase</li>
      </ul>
    </div>
    <div class="grid">${days.map(dayCell).join('')}</div>
    <div class="foot"><p><strong>Cómo se usa:</strong> cada día se abre una puerta nueva en carla-lopez.com/adviento y te llega un correo. Ve a tu ritmo: nada caduca y puedes recuperar los días que te saltes. Cuelga esta hoja donde la veas.</p><span class="site">carla-lopez.com</span></div>
  </div>`;

  const page2 = `<div class="page">
    ${head('Hoja de trabajo · Días 1 y 24')}
    <div class="p2-intro"><h1>Tu mapa de tareas</h1><p>Rellena esta hoja el día 1, mientras haces el reto con Claude. El 24 de diciembre vuelves a ella y completas la última columna: así ves cuánto ha cambiado en 24 días. Escribe a lápiz.</p></div>
    <section>
      <h2>Las tres tareas que más tiempo me quitan</h2>
      <table><thead><tr><th></th><th>La tarea</th><th style="width:24mm">Horas a la semana</th><th>Qué me molesta de ella</th><th class="later" style="width:44mm">¿Cómo va el día 24?<span class="tag">DÍA 24</span></th></tr></thead>
      <tbody>${[1, 2, 3].map(n => `<tr><td class="n">${n}</td><td></td><td></td><td></td><td class="later"></td></tr>`).join('')}</tbody></table>
    </section>
    <section>
      <h2>La que no conviene delegar todavía</h2>
      <p>Siempre hay una parte del trabajo que necesita tu criterio. Escríbela ahora: así sabrás dónde está tu límite cuando empieces a automatizar.</p>
      <div class="line"></div>
    </section>
    <section>
      <h2>El semáforo de datos</h2>
      <p>Antes de pegar nada en una IA: si te importaría que apareciera en una captura de pantalla, no lo pegues.</p>
      <div class="cards">
        <div class="card"><h3><span class="dot" style="background:#C2412F"></span>Rojo · no lo pegues</h3><p>Datos bancarios, DNI, salud, nóminas con nombre, contraseñas y contratos confidenciales.</p></div>
        <div class="card"><h3><span class="dot" style="background:#F3C969"></span>Ámbar · anonimízalo</h3><p>Correos, hojas internas e informes, solo sin nombres («Cliente A») o si tu empresa lo permite.</p></div>
        <div class="card"><h3><span class="dot" style="background:#4F7A4A"></span>Verde · adelante</h3><p>Textos tuyos sin datos de nadie, información pública, borradores, plantillas y datos inventados.</p></div>
      </div>
    </section>
    <div class="two">
      <div class="card"><h3>Lo que sabrás hacer el día 24</h3><p class="sub">Márcalo en Nochebuena. El 1 de diciembre no había ninguna casilla.</p><ul class="checks">${skills.map(s => `<li><span class="box"></span>${s}</li>`).join('')}</ul></div>
      <div class="card"><h3>Las tres preguntas</h3><p class="sub">Del día 6. Para cuando dudes de lo que te ha devuelto:</p><ul class="checks"><li><span class="box"></span>¿De dónde sale este número?</li><li><span class="box"></span>¿Qué has dado por supuesto?</li><li><span class="box"></span>¿Qué puede estar mal en esto?</li></ul><p class="rule">Si vas a poner tu nombre debajo, revísalo tú. La IA no responde ante tu jefe. Tú sí.</p><blockquote>No te vas a volver técnica. Te vas a volver alguien que sabe pedir ayuda a una máquina y comprobar lo que le da.</blockquote></div>
    </div>
  </div>`;

  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${css}</style></head><body>${sprite}${page1}${page2}</body></html>`;
}
