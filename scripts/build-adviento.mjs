import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';

const root = 'Adviento';
const titles = [
  'Tu mapa de tareas', 'Conectores sin miedo', 'Tu primer conector', 'Un proyecto para tu trabajo',
  'Tu mini-app en 5 minutos', 'Cómo cazar un error', 'Tu primera tarea programada', '5 frases para pedir mejor',
  'De notas a presentación', 'Pregúntale a tus documentos', 'De reunión a próximos pasos', 'Mi asistente de oficina',
  'Tu primer vídeo con IA', 'Informe sin empezar de cero', 'Diseño sin ser diseñadora', 'Investigar con fuentes',
  '¿Cuándo uso cada una?', 'Tu asistente reutilizable', 'Pack de tareas programadas', 'Claude en tu navegador',
  'Prepara tu lunes', 'Tu vigilante de la bandeja', 'Tú decides, ella prepara', 'Tu mapa de 2027'
];
const symbols = ['⌖','⚿','⟟','▣','✦','⌕','◷','◌','▰','▤','☷','✧','▹','▥','◈','✥','⑂','⚙','✧','⌁','◒','✉','◉','✶'];
const types = ['Reto + regalo','Tip','Reto','Tip','Sorpresa','Tip','Reto','Tip','Reto','Reto','Reto','Regalo','Sorpresa','Reto','Reto','Formación','Tip','Reto','Regalo','Sorpresa','Reto','Reto','Reto','Regalo'];
const descriptions = [
  'Haz un mapa de tus tareas y descubre por dónde empezar. Hoy también te llevas el kit de arranque.',
  'Entiende qué puede ver un conector y aprende a revisar sus permisos antes de usarlo.',
  'Conecta tu calendario y pídele a Claude un resumen útil de tu semana. Hay alternativa con datos de prueba.',
  'Crea un proyecto que recuerde el contexto de tu trabajo para no repetirlo en cada conversación.',
  'Pide una pequeña herramienta hecha a tu medida y ajústala con un segundo mensaje.',
  'Pon a prueba una respuesta de la IA con un archivo que esconde errores. Aprende a detectarlos.',
  'Prepara una tarea que trabaje sola a una hora concreta y comprueba su resultado.',
  'Aprende cinco frases que vuelven cualquier petición a la IA mucho más clara.',
  'Convierte datos de prueba en una presentación breve y comprueba que cada cifra sea correcta.',
  'Haz preguntas a un documento de ejemplo y encuentra respuestas con fuentes comprobables.',
  'Transforma notas de una reunión en un acta con tareas, responsables y próximos pasos.',
  'Descarga una plantilla de asistente de oficina y adáptala a tu forma de trabajar.',
  'Crea un vídeo breve con IA por pura curiosidad. Usa una idea propia y cuida los permisos.',
  'Cruza dos archivos de prueba y prepara un informe con conclusiones que puedas verificar.',
  'Diseña una pieza útil para tu trabajo con ayuda de Claude y Canva.',
  'Investiga un tema con enlaces y aprende a distinguir una fuente sólida de una respuesta convincente.',
  'Elige la herramienta adecuada para cada tarea con una tabla sencilla.',
  'Convierte un procedimiento repetido en un asistente que puedas volver a usar.',
  'Llévate cinco tareas programadas listas para adaptar a tu semana.',
  'Prueba cómo una IA puede ayudarte a navegar, leer y actuar en páginas web con criterio.',
  'Reúne calendario, correo y un archivo de prueba en un solo plan para el lunes.',
  'Prepara un vigilante de la bandeja que detecte lo importante sin enviar nada por ti.',
  'Decide qué puede hacer la IA sola, qué debe consultarte y qué prefieres hacer tú.',
  'Vuelve a tu mapa del día 1 y escribe tres pasos concretos para empezar 2027.'
];
const shared = {
  1: ['00-kit-de-arranque/10-prompts-de-oficina.md','00-kit-de-arranque/tarjeta-de-contexto.md','00-kit-de-arranque/semaforo-de-datos.md'],
  6: ['_datos-de-prueba/facturas-2026.csv'],
  7: ['_datos-de-prueba/facturas-2026.csv'],
  9: ['_datos-de-prueba/ventas-2026.csv'],
  14: ['_datos-de-prueba/ventas-2026.csv','_datos-de-prueba/facturas-2026.csv'],
  16: ['_datos-de-prueba/ventas-2026.csv'],
  21: ['_datos-de-prueba/facturas-2026.csv','_datos-de-prueba/bandeja-entrada.csv'],
  22: ['_datos-de-prueba/bandeja-entrada.csv']
};
const exclude = /^(Por qué|Por verificar|Para el vídeo|El tono de hoy|Dónde va el anuncio|Variantes que podemos añadir|Lo que aprende|Conexión con el final|Lo que NO vamos a hacer|Por qué tanto aviso)/i;
const dirs = readdirSync(root, { withFileTypes: true }).filter(d => d.isDirectory() && /^dia-\d\d-/.test(d.name)).sort((a,b) => a.name.localeCompare(b.name));
const days = dirs.map((dir, index) => {
  const day = Number(dir.name.slice(4,6));
  const path = join(root, dir.name);
  const ficha = readFileSync(join(path, 'ficha.md'), 'utf8');
  const field = key => ficha.match(new RegExp('^\\*\\*' + key + ':\\*\\*\\s*(.+)$', 'm'))?.[1]?.replace(/`/g, '') || '';
  const sections = [...ficha.matchAll(/^## (.+)\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm)]
    .map(([,heading,body]) => ({ heading, body: body.trim() }))
    .filter(({heading,body}) => body && !exclude.test(heading));
  const objective = descriptions[index];
  const attachments = readdirSync(path).filter(name => name !== 'ficha.md' && name !== 'prompt.md' && !name.startsWith('.'))
    .map(name => ({ name, content: readFileSync(join(path, name), 'utf8'), mime: name.endsWith('.csv') ? 'text/csv;charset=utf-8' : 'text/markdown;charset=utf-8' }));
  for (const filename of shared[day] || []) attachments.push({ name: basename(filename), content: readFileSync(join(root, filename), 'utf8'), mime: filename.endsWith('.csv') ? 'text/csv;charset=utf-8' : 'text/markdown;charset=utf-8' });
  const prompt = readdirSync(path).includes('prompt.md') ? readFileSync(join(path,'prompt.md'),'utf8') : '';
  return {
    dia: day, titulo: titles[index], tipo: types[index], herramienta: field('Herramienta'),
    minutos: Number(field('Tiempo').match(/\d+/)?.[0] || 10), datos: field('Datos'),
    descripcion: objective, simbolo: symbols[index], abre_el: `2026-12-${String(day).padStart(2,'0')}`,
    contenido: { secciones: [...sections.filter(s => s.heading !== 'Objetivo'), ...(day === 24 ? [{heading:'Y después',body:'Si quieres seguir, en enero abriré un curso para profundizar en lo que has practicado aquí. Te avisaré por correo si elegiste recibir novedades. Y si lo dejas aquí, te llevas 24 cosas que antes no sabías hacer.\n\nFeliz Navidad.'}] : [])], prompt, recursos: attachments }
  };
});
if (days.length !== 24 || days.some((d,i) => d.dia !== i+1)) throw new Error('Deben existir 24 fichas ordenadas.');
mkdirSync('src/data', { recursive: true });
writeFileSync('src/data/adviento-meta.json', JSON.stringify(days.map(({contenido,...meta}) => meta), null, 2) + '\n');
// Solo se incrusta en las páginas durante `astro dev`; nunca en la build publicada.
writeFileSync('src/data/adviento-preview.json', JSON.stringify(days, null, 2) + '\n');
const quote = value => `'${String(value).replaceAll("'", "''")}'`;
const sql = days.map(day => `insert into public.adviento_dias (dia,titulo,tipo,herramienta,minutos,datos,descripcion,simbolo,abre_el) values (${day.dia},${quote(day.titulo)},${quote(day.tipo)},${quote(day.herramienta)},${day.minutos},${quote(day.datos)},${quote(day.descripcion)},${quote(day.simbolo)},${quote(day.abre_el)}) on conflict (dia) do update set titulo=excluded.titulo,tipo=excluded.tipo,herramienta=excluded.herramienta,minutos=excluded.minutos,datos=excluded.datos,descripcion=excluded.descripcion,simbolo=excluded.simbolo,abre_el=excluded.abre_el;\ninsert into public.adviento_contenido (dia,contenido) values (${day.dia},${quote(JSON.stringify(day.contenido))}::jsonb) on conflict (dia) do update set contenido=excluded.contenido;`).join('\n');
writeFileSync('supabase/adviento-seed.sql', '-- Generado desde Adviento/ con npm run build:adviento.\n' + sql + '\n');
console.log(`Preparados ${days.length} días y ${days.reduce((n,d)=>n+d.contenido.recursos.length,0)} descargas.`);
