import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, readdir, mkdir, writeFile, rename } from 'node:fs/promises';
import { join } from 'node:path';

const run = promisify(execFile);
const root = process.cwd();
const sourceRoot = join(root, 'Adviento');
const endpoint = '/__adviento_editor';
let saving = Promise.resolve();

function localRequest(req) {
  const address = req.socket.remoteAddress || '';
  let host;
  try { host = new URL(`http://${req.headers.host}`).hostname.replace(/^\[|\]$/g, ''); }
  catch { return false; }
  const loopback = ['localhost', '127.0.0.1', '::1'];
  if (!loopback.includes(host) || !['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(address)) return false;
  if (req.method !== 'GET') {
    try { if (new URL(req.headers.origin || '').host !== req.headers.host) return false; }
    catch { return false; }
  }
  return true;
}

async function dayPath(day) {
  if (!Number.isInteger(day) || day < 1 || day > 24) throw new Error('Día no válido.');
  const prefix = `dia-${String(day).padStart(2, '0')}-`;
  const dir = (await readdir(sourceRoot)).find(name => name.startsWith(prefix));
  if (!dir) throw new Error('No se encuentra el archivo de este día.');
  return join(sourceRoot, dir, 'web.md');
}

function send(res, status, data) {
  res.writeHead(status, { 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff' });
  res.end(JSON.stringify(data));
}

async function body(req) {
  const chunks = []; let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 22 * 1024 * 1024) throw new Error('El archivo supera el límite de 15 MB.');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function parse(source, meta) {
  const start = source.search(/^## /m);
  const head = start < 0 ? source : source.slice(0, start);
  const field = name => head.match(new RegExp(`^${name}:\\s*(.*)$`, 'm'))?.[1]?.trim() || '';
  return {
    titulo:head.match(/^# (.*)$/m)?.[1]?.trim() || '',
    descripcion:field('resumen'), datos:field('datos'),
    tipo:field('tipo') || meta.tipo, herramienta:field('herramienta') || meta.herramienta,
    minutos:field('minutos') || String(meta.minutos),
    cuerpo:start < 0 ? '' : source.slice(start).trim()
  };
}

function validate(data) {
  const fields = ['titulo','descripcion','datos','tipo','herramienta','minutos','cuerpo'];
  for (const name of fields) if (typeof data[name] !== 'string' || data[name].length > 150_000) throw new Error(`El campo ${name} no es válido.`);
  for (const name of fields.filter(name => name !== 'cuerpo')) {
    if (!data[name].trim() || /[\r\n]/.test(data[name])) throw new Error(`Revisa el campo ${name}.`);
  }
  if (!/^\d{1,3}$/.test(data.minutos) || Number(data.minutos) < 1) throw new Error('El tiempo debe estar entre 1 y 999 minutos.');
  if (!/^## /m.test(data.cuerpo)) throw new Error('Añade al menos una sección que empiece por «## ».');
}

async function save(day, data) {
  validate(data);
  const path = await dayPath(day);
  const previous = await readFile(path, 'utf8');
  const source = `# ${data.titulo.trim()}\nresumen: ${data.descripcion.trim()}\ndatos: ${data.datos.trim()}\ntipo: ${data.tipo.trim()}\nherramienta: ${data.herramienta.trim()}\nminutos: ${data.minutos.trim()}\n\n${data.cuerpo.trim()}\n`;
  const temp = `${path}.tmp`;
  await writeFile(temp, source);
  await rename(temp, path);
  try {
    await run(process.execPath, ['scripts/build-adviento.mjs'], { cwd:root, maxBuffer:4 * 1024 * 1024 });
  } catch (error) {
    await writeFile(path, previous);
    await run(process.execPath, ['scripts/build-adviento.mjs'], { cwd:root, maxBuffer:4 * 1024 * 1024 }).catch(() => {});
    throw new Error(`No se ha guardado: ${String(error.stderr || error.message).trim().slice(0, 500)}`);
  }
  return { ok:true };
}

async function upload(day, data) {
  await dayPath(day);
  if (typeof data.name !== 'string' || typeof data.content !== 'string' || typeof data.kind !== 'string') throw new Error('Archivo no válido.');
  const name = data.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '');
  const extension = name.match(/\.[a-z0-9]+$/)?.[0] || '';
  const image = ['.png','.jpg','.jpeg','.webp','.gif','.avif'].includes(extension);
  const document = ['.pdf','.doc','.docx','.ppt','.pptx','.xls','.xlsx','.csv','.md','.txt','.zip','.odt','.ods','.odp'].includes(extension);
  if ((data.kind === 'image' && !image) || (data.kind === 'document' && !document)) throw new Error('Formato de archivo no admitido.');
  if (!/^[a-zA-Z0-9+/]*={0,2}$/.test(data.content)) throw new Error('El archivo no se ha podido leer.');
  const bytes = Buffer.from(data.content, 'base64');
  if (!bytes.length || bytes.length > 15 * 1024 * 1024) throw new Error('El archivo debe ocupar entre 1 byte y 15 MB.');
  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 10);
  const file = `${String(day).padStart(2, '0')}-${hash}-${name}`;
  const folder = data.kind === 'image' ? join(sourceRoot, '_capturas') : join(sourceRoot, '_uploads');
  await mkdir(folder, { recursive:true });
  await writeFile(join(folder, file), bytes);
  return { file:data.kind === 'image' ? `capturas/${file}` : `_uploads/${file}`, name:data.name };
}

export default function adventLocalEditor() {
  return {
    name:'adviento-local-editor',
    apply:'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith(endpoint)) return next();
        if (!localRequest(req)) return send(res, 403, { error:'El editor solo está disponible en localhost.' });
        try {
          const url = new URL(req.url, 'http://localhost');
          const day = Number(url.searchParams.get('dia'));
          if (req.method === 'GET') {
            const path = await dayPath(day);
            const meta = JSON.parse(await readFile(join(root, 'src/data/adviento-meta.json'), 'utf8')).find(item => item.dia === day);
            return send(res, 200, parse(await readFile(path, 'utf8'), meta));
          }
          if (req.method !== 'POST') return send(res, 405, { error:'Método no permitido.' });
          const data = await body(req);
          if (url.searchParams.get('action') === 'upload') return send(res, 200, await upload(day, data));
          const task = saving.then(() => save(day, data));
          saving = task.catch(() => {});
          return send(res, 200, await task);
        } catch (error) {
          return send(res, 400, { error:error instanceof Error ? error.message : 'No se pudo completar la operación.' });
        }
      });
    }
  };
}
