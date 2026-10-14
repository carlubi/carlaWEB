import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

/* Plantilla de los PDF descargables: misma marca que la web (DESIGN.md). Cambiar esta versión regenera las URLs. */
export const PDF_TEMPLATE_VERSION = '1';

const fonts = pathToFileURL(resolve('public/fonts')).href;
const css = `
@font-face{font-family:'Inter Tight';src:url('${fonts}/inter-tight-latin-400-normal.woff2') format('woff2');font-weight:400}
@font-face{font-family:'Inter Tight';src:url('${fonts}/inter-tight-latin-600-normal.woff2') format('woff2');font-weight:600}
@page{size:A4;margin:18mm 19mm 18mm}
*{box-sizing:border-box}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{margin:0;font:400 10.5pt/1.55 'Inter Tight',Arial,sans-serif;color:#3B252D}
.doc-head{display:flex;justify-content:space-between;align-items:baseline;padding-bottom:9px;margin-bottom:26px;border-bottom:1px solid rgba(59,37,45,.14);font-size:8.5pt;color:#6B5960}
.doc-head strong{color:#691B32;font-size:11pt;letter-spacing:-.02em}
h1{margin:0 0 10px;color:#691B32;font-size:25pt;line-height:1.08;font-weight:600;letter-spacing:-.025em}
h1+p{font-size:11.5pt;color:#6B5960}
h2{margin:22px 0 8px;color:#691B32;font-size:14pt;line-height:1.2;font-weight:600;break-after:avoid}
h3{margin:16px 0 6px;font-size:11.5pt;font-weight:600;break-after:avoid}
p{margin:0 0 8px}
strong{font-weight:600}
em{color:#6B5960}
a{color:#691B32}
ul,ol{margin:0 0 10px;padding-left:20px}
li{margin:3px 0}
hr{border:0;border-top:1px solid rgba(59,37,45,.14);margin:20px 0}
blockquote{margin:10px 0;padding:10px 14px;border-left:3px solid #691B32;border-radius:0 8px 8px 0;background:#F8F5ED;break-inside:avoid}
blockquote p:last-child{margin:0}
table{width:100%;border-collapse:collapse;margin:8px 0 14px;font-size:9.5pt;break-inside:auto}
th{text-align:left;background:#F8F5ED;font-weight:600}
th,td{padding:7px 9px;border-bottom:1px solid rgba(59,37,45,.14);vertical-align:top}
tr{break-inside:avoid}
code{font:inherit;background:#F8F5ED;padding:0 3px;border-radius:3px}
.contains-task-list{list-style:none;padding-left:0}
.task-list-item input{appearance:none;-webkit-appearance:none;width:11px;height:11px;margin:0 9px 0 0;border:1.5px solid #691B32;border-radius:2px;vertical-align:-1px}
p.fill{padding-bottom:22px;border-bottom:1px solid rgba(59,37,45,.22);margin-bottom:12px}
.doc-foot{margin-top:28px;padding-top:9px;border-top:1px solid rgba(59,37,45,.14);font-size:8.5pt;color:#6B5960}
`;

/* Las líneas «**Campo:**» sin texto detrás son huecos para rellenar a mano. */
const markFillLines = html => html.replace(/<p><strong>([^<]{1,60}):<\/strong>(\s*<em>[\s\S]*?<\/em>)?\s*<\/p>/g, (m) => m.replace('<p>', '<p class="fill">'));

function chromePath() {
  const candidates = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'];
  const found = candidates.find(path => path && existsSync(path));
  if (!found) throw new Error('No encuentro Chrome para generar los PDF. Indica su ruta con CHROME_PATH=/ruta/a/chrome.');
  return found;
}

/* Fuentes de la web para maquetas propias (p. ej. el calendario imprimible). */
export const fontFaces = css.slice(0, css.indexOf('@page'));

export function createPdfRenderer() {
  const chrome = chromePath();
  const work = mkdtempSync(join(tmpdir(), 'adviento-pdf-'));
  let count = 0;
  function renderDocument(documentHtml, outFile) {
      const page = join(work, `doc-${count++}.html`);
      writeFileSync(page, documentHtml);
      const result = spawnSync(chrome, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', `--user-data-dir=${join(work, 'profile')}`, '--no-pdf-header-footer', '--run-all-compositor-stages-before-draw', '--virtual-time-budget=2000', `--print-to-pdf=${outFile}`, pathToFileURL(page).href], { encoding:'utf8', timeout:60000 });
      if (result.status !== 0 || !existsSync(outFile)) throw new Error(`Chrome no ha podido generar ${outFile}: ${result.stderr || result.error}`);
  }
  return {
    /* Documento de texto (Markdown ya convertido) con la plantilla de marca. */
    render(bodyHtml, outFile) {
      renderDocument(`<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${css}</style></head><body><div class="doc-head"><strong>carla lópez</strong><span>Calendario de Adviento IA · 2026</span></div>${markFillLines(bodyHtml)}<div class="doc-foot">carla-lopez.com</div></body></html>`, outFile);
    },
    /* Documento HTML completo con su propia maqueta. */
    renderDocument,
    close() { rmSync(work, { recursive:true, force:true }); }
  };
}
