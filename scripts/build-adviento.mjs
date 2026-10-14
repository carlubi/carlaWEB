import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { createPdfRenderer, PDF_TEMPLATE_VERSION } from './adviento-pdf.mjs';
import { calendarDocument } from './adviento-calendario.mjs';

/*
 * Genera el contenido del Adviento a partir de Adviento/:
 *  - dia-NN-…/web.md  → texto de la web (ver Adviento/LEEME.md, «Formato de web.md»)
 *  - dia-NN-…/ficha.md → solo herramienta y tiempo
 * Las descargas se publican en public/adviento/descargas/<huella>/ (PDF con marca o CSV),
 * con una huella del contenido en la ruta: no se pueden adivinar sin abrir el día.
 */
const root = 'Adviento';
const downloadsDir = 'public/adviento/descargas';
const types = ['Reto + regalo','Tip','Reto','Tip','Sorpresa','Tip','Reto','Tip','Reto','Reto','Reto','Regalo','Sorpresa','Reto','Reto','Formación','Tip','Reto','Regalo','Sorpresa','Reto','Reto','Reto','Regalo'];
const symbols = ['⌖','⚿','⟟','▣','✦','⌕','◷','◌','▰','▤','☷','✧','▹','▥','◈','✥','⑂','⚙','✧','⌁','◒','✉','◉','✶'];
/* Nada de rutas ni nombres de archivo internos en lo que ve la usuaria. */
const internalRef = /\b[\w-]+\.md\b|00-kit-de-arranque|_datos-de-prueba|_plantillas-base|\bdia-\d\d-|Notas para ti|Silvia/;

const markdown = unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeStringify);
const toHtml = text => String(markdown.processSync(text.trim()));
const plain = text => text.replace(/\*\*|`/g, '').trim();
const fail = (where, message) => { throw new Error(`${where}: ${message}`); };

const pdf = createPdfRenderer();
rmSync(downloadsDir, { recursive:true, force:true });
const published = new Map();

function formatSize(bytes) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} MB`;
}

/* El texto que se copia de una plantilla: lo que va entre la primera y la última línea «---». */
function templateText(source) {
  const lines = source.split('\n');
  const rules = lines.flatMap((line, i) => line.trim() === '---' ? [i] : []);
  const body = rules.length >= 2 ? lines.slice(rules[0] + 1, rules.at(-1)) : lines.slice(1);
  return body.filter(line => line.trim() !== '---').join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

/* Archivos que no salen de Adviento/ sino que se generan aquí. */
const generated = { '@calendario-imprimible': { name:'calendario-imprimible.pdf', html:() => calendarDocument(calendarDays) } };

function publishGenerated(where, file) {
  const item = generated[file] || fail(where, `no conozco el archivo generado ${file}`);
  if (!published.has(file)) {
    const html = item.html();
    const hash = createHash('sha256').update(html).digest('hex').slice(0, 12);
    const dir = join(downloadsDir, hash); mkdirSync(dir, { recursive:true });
    const out = join(dir, item.name);
    pdf.renderDocument(html, out);
    published.set(file, { url:`/adviento/descargas/${hash}/${item.name}`, peso:formatSize(statSync(out).size) });
  }
  return { nombre:item.name, formato:'PDF', ...published.get(file) };
}

function publishDownload(where, file, copy) {
  if (file.startsWith('@')) return publishGenerated(where, file);
  const source = join(root, file);
  if (!existsSync(source)) fail(where, `no existe ${source}`);
  const content = readFileSync(source, 'utf8');
  const isCsv = extname(file) === '.csv';
  if (!isCsv && extname(file) !== '.md') fail(where, `solo se publican .md (como PDF) o .csv: ${file}`);
  const name = isCsv ? basename(file) : basename(file, '.md') + '.pdf';
  if (!published.has(file)) {
    const hash = createHash('sha256').update(content).update(isCsv ? '' : PDF_TEMPLATE_VERSION).digest('hex').slice(0, 12);
    const dir = join(downloadsDir, hash); mkdirSync(dir, { recursive:true });
    const out = join(dir, name);
    if (isCsv) copyFileSync(source, out); else pdf.render(toHtml(content), out);
    published.set(file, { url:`/adviento/descargas/${hash}/${name}`, peso:formatSize(statSync(out).size) });
  }
  return { nombre:name, formato:isCsv ? 'CSV' : 'PDF', ...published.get(file), ...(copy ? { copiar:templateText(content) } : {}) };
}

function parsePrompt(where, title, body) {
  const blocks = []; let buffer = []; let mode = null;
  const flush = () => {
    if (mode === 'quote') {
      const lines = buffer.join('\n').trim().split('\n');
      const attachments = lines.filter(line => /^\[adjunta .+\]$/.test(line.trim()))
        .flatMap(line => line.trim().slice(9, -1).split(/,| y /).map(name => plain(name)).filter(Boolean));
      const text = lines.filter(line => !/^\[adjunta .+\]$/.test(line.trim())).join('\n').trim();
      blocks.push({ tipo:'prompt', html:toHtml(text), texto:plain(text), ...(attachments.length ? { adjuntos:attachments } : {}) });
    } else if (mode === 'text' && buffer.join('').trim()) blocks.push({ tipo:'texto', html:toHtml(buffer.join('\n')) });
    buffer = []; mode = null;
  };
  for (const line of body.split('\n')) {
    if (line.startsWith('>')) { if (mode !== 'quote') flush(); mode = 'quote'; buffer.push(line.replace(/^> ?/, '')); }
    else if (!line.trim()) { if (mode === 'quote') flush(); else if (mode === 'text') buffer.push(line); }
    else { if (mode !== 'text') flush(); mode = 'text'; buffer.push(line); }
  }
  flush();
  if (!blocks.some(block => block.tipo === 'prompt')) fail(where, `«Prompt · ${title}» no tiene ningún texto citado con >`);
  return { titulo:title, bloques:blocks };
}

function parseDownload(where, title, body) {
  const lines = body.split('\n');
  const file = lines.find(line => line.startsWith('archivo:'))?.slice(8).trim();
  if (!file) fail(where, `«Descarga · ${title}» necesita una línea «archivo: carpeta/archivo»`);
  const copy = lines.some(line => /^copiar:\s*s[ií]/i.test(line));
  const description = lines.filter(line => !/^(archivo|copiar):/.test(line)).join(' ').trim();
  return { titulo:title, descripcion:description, ...publishDownload(where, file, copy) };
}

function parseWeb(where, source) {
  const [head, ...chunks] = source.split(/^## /m);
  const title = head.match(/^# (.+)$/m)?.[1]?.trim() || fail(where, 'falta el título «# …»');
  const field = key => head.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.trim() || '';
  const content = { secciones:[], prompts:[], descargas:[] };
  for (const chunk of chunks) {
    const [heading, ...rest] = chunk.split('\n');
    const body = rest.join('\n').trim();
    const kind = heading.match(/^(Prompt|Descarga) · (.+)$/);
    if (kind?.[1] === 'Prompt') content.prompts.push(parsePrompt(where, kind[2].trim(), body));
    else if (kind?.[1] === 'Descarga') content.descargas.push(parseDownload(where, kind[2].trim(), body));
    else if (body) content.secciones.push({ titulo:heading.trim(), html:toHtml(body) });
  }
  const names = new Set(content.descargas.map(d => d.nombre));
  for (const name of content.prompts.flatMap(p => p.bloques.flatMap(b => b.adjuntos || [])))
    if (!names.has(name)) fail(where, `un prompt pide adjuntar «${name}», pero no hay ninguna descarga con ese nombre`);
  const visible = JSON.stringify([title, field('resumen'), field('datos'), content.secciones, content.prompts.map(p => p.bloques.map(b => b.html)), content.descargas.map(d => [d.titulo, d.descripcion])]);
  const leak = visible.match(internalRef);
  if (leak) fail(where, `el texto visible menciona «${leak[0]}», que es interno`);
  return { title, summary:field('resumen'), data:field('datos'), content };
}

const dirs = readdirSync(root, { withFileTypes:true }).filter(d => d.isDirectory() && /^dia-\d\d-/.test(d.name)).sort((a, b) => a.name.localeCompare(b.name));
const fichaField = (ficha, key) => ficha.match(new RegExp('^\\*\\*' + key + ':\\*\\*\\s*(.+)$', 'm'))?.[1]?.replace(/`/g, '') || '';
/* Lo que necesita el calendario imprimible antes de procesar cada día. */
const calendarDays = dirs.map((dir, index) => {
  const path = join(root, dir.name);
  const ficha = readFileSync(join(path, 'ficha.md'), 'utf8');
  const web = existsSync(join(path, 'web.md')) ? readFileSync(join(path, 'web.md'), 'utf8') : '';
  return {
    dia:Number(dir.name.slice(4, 6)), titulo:web.match(/^# (.+)$/m)?.[1]?.trim() || '', tipo:types[index],
    herramienta:fichaField(ficha, 'Herramienta').replace(/^./, c => c.toUpperCase()),
    minutos:Number(fichaField(ficha, 'Tiempo').match(/\d+/)?.[0] || 10)
  };
});
let days;
try {
  days = dirs.map((dir, index) => {
    const day = Number(dir.name.slice(4, 6));
    const path = join(root, dir.name);
    const where = join(path, 'web.md');
    if (!existsSync(where)) fail(where, 'falta el texto de la web');
    const web = parseWeb(where, readFileSync(where, 'utf8'));
    if (!web.summary) fail(where, 'falta la línea «resumen: …»');
    return {
      ...calendarDays[index], titulo:web.title, datos:web.data,
      descripcion:web.summary, simbolo:symbols[index], abre_el:`2026-12-${String(day).padStart(2, '0')}`,
      contenido:web.content
    };
  });
} finally { pdf.close(); }
if (days.length !== 24 || days.some((d, i) => d.dia !== i + 1)) throw new Error('Deben existir 24 días ordenados.');

mkdirSync('src/data', { recursive:true });
writeFileSync('src/data/adviento-meta.json', JSON.stringify(days.map(({ contenido, ...meta }) => meta), null, 2) + '\n');
// Solo se incrusta en las páginas durante `astro dev`; nunca en la build publicada.
writeFileSync('src/data/adviento-preview.json', JSON.stringify(days, null, 2) + '\n');
const quote = value => `'${String(value).replaceAll("'", "''")}'`;
const sql = days.map(day => `insert into public.adviento_dias (dia,titulo,tipo,herramienta,minutos,datos,descripcion,simbolo,abre_el) values (${day.dia},${quote(day.titulo)},${quote(day.tipo)},${quote(day.herramienta)},${day.minutos},${quote(day.datos)},${quote(day.descripcion)},${quote(day.simbolo)},${quote(day.abre_el)}) on conflict (dia) do update set titulo=excluded.titulo,tipo=excluded.tipo,herramienta=excluded.herramienta,minutos=excluded.minutos,datos=excluded.datos,descripcion=excluded.descripcion,simbolo=excluded.simbolo,abre_el=excluded.abre_el;\ninsert into public.adviento_contenido (dia,contenido) values (${day.dia},${quote(JSON.stringify(day.contenido))}::jsonb) on conflict (dia) do update set contenido=excluded.contenido;`).join('\n');
writeFileSync('supabase/adviento-seed.sql', '-- Generado desde Adviento/ con npm run build:adviento.\n' + sql + '\n');
console.log(`Preparados ${days.length} días, ${days.reduce((n, d) => n + d.contenido.prompts.length, 0)} prompts y ${published.size} archivos descargables.`);
