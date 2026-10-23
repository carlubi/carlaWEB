/**
 * Ilustraciones de las diapositivas del calendario, dibujadas a mano en SVG.
 * Cada una está pensada para el texto de su diapositiva (día + título exacto):
 * si la diapositiva habla de markdown, se ve una hoja con # y **; si habla de
 * permisos, un cuadro de permisos. Solo llevan dibujo las diapositivas de esta lista.
 */
export type Drawing = { alt:string; svg:string };

/* ---------- piezas básicas (todas devuelven SVG como texto) ---------- */
const n = (v:number) => +v.toFixed(1);
const esc = (s:string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const t = (x:number, y:number, s:string, cls = '') => `<text x="${x}" y="${y}" class="tx ${cls}">${esc(s)}</text>`;
/* texto monoespaciado; lo que va entre {llaves} sale en granate (los símbolos de markdown) */
const code = (x:number, y:number, s:string, cls = '') => `<text x="${x}" y="${y}" class="tx mono ${cls}">${esc(s).replace(/\{([^}]*)\}/g, '<tspan class="tc">$1</tspan>')}</text>`;
const r = (x:number, y:number, w:number, h:number, cls = 'o p', rx = 6) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" class="${cls}"/>`;
const c = (x:number, y:number, rad:number, cls = 'o p') => `<circle cx="${x}" cy="${y}" r="${rad}" class="${cls}"/>`;
const p = (d:string, cls = 'o n') => `<path d="${d}" class="${cls}"/>`;
const g = (transform:string, inner:string) => `<g transform="${transform}">${inner}</g>`;
const lines = (x:number, y:number, w:number, count:number, gap = 13, cls = 'ln') =>
  Array.from({ length:count }, (_, i) => p(`M${x} ${y + i * gap}h${n(i === count - 1 && count > 1 ? w * .55 : w * (i % 2 ? .86 : 1))}`, cls)).join('');
const paper = (x:number, y:number, w:number, h:number, cls = 'o p') =>
  p(`M${x} ${y}h${w - 18}l18 18v${h - 18}h${-w}z`, cls) + p(`M${x + w - 18} ${y}v18h18`, 'o s');
const win = (x:number, y:number, w:number, h:number, title = '') =>
  r(x, y, w, h, 'o p', 10) + p(`M${x} ${y + 22}h${w}`) + c(x + 12, y + 11, 3.5, 'c') + c(x + 23, y + 11, 3.5, 'y') + c(x + 34, y + 11, 3.5, 'h') +
  (title ? t(x + 44, y + 15, title, 'xs tm') : '');
const check = (x:number, y:number, rad = 11) => c(x, y, rad, 'h') + p(`M${n(x - rad * .45)} ${y}l${n(rad * .3)} ${n(rad * .32)} ${n(rad * .58)}-${n(rad * .62)}`, 'w3');
const cross = (x:number, y:number, rad = 11) => c(x, y, rad, 'c') + p(`M${n(x - rad * .36)} ${n(y - rad * .36)}l${n(rad * .72)} ${n(rad * .72)}M${n(x + rad * .36)} ${n(y - rad * .36)}l${n(-rad * .72)} ${n(rad * .72)}`, 'w3');
function arrow(x1:number, y1:number, x2:number, y2:number, bend = 0, cls = 'arw') {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const cx = (x1 + x2) / 2 - (y2 - y1) / len * bend, cy = (y1 + y2) / 2 + (x2 - x1) / len * bend;
  const a = Math.atan2(y2 - cy, x2 - cx), h = 9;
  return p(`M${x1} ${y1}Q${n(cx)} ${n(cy)} ${x2} ${y2}M${n(x2 - h * Math.cos(a - .5))} ${n(y2 - h * Math.sin(a - .5))}L${x2} ${y2}L${n(x2 - h * Math.cos(a + .5))} ${n(y2 - h * Math.sin(a + .5))}`, cls);
}
const person = (x:number, y:number, shirt = 'c') => p(`M${x - 22} ${y + 44}q0-27 22-27t22 27z`, `o ${shirt}`) + c(x, y, 13, 'o cs');
/* el asistente: una chispa de cuatro puntas */
const spark = (x:number, y:number, rad = 12, cls = 'c') => p(`M${x} ${y - rad}Q${x} ${y} ${x + rad} ${y}Q${x} ${y} ${x} ${y + rad}Q${x} ${y} ${x - rad} ${y}Q${x} ${y} ${x} ${y - rad}z`, cls);
const toggle = (x:number, y:number, on:boolean) => r(x, y, 38, 20, on ? 'o h' : 'o s', 10) + c(on ? x + 28 : x + 10, y + 10, 7, 'o p');
const envelope = (x:number, y:number, w:number, h:number, cls = 'o p') => r(x, y, w, h, cls, 4) + p(`M${x} ${y}l${w / 2} ${n(h * .55)}l${w / 2}-${n(h * .55)}`);
const pill = (x:number, y:number, w:number, label:string, cls = 'o y', tcls = 'sm') => r(x, y, w, 26, cls, 13) + t(x + w / 2, y + 17, label, `${tcls} mid`);
const keycap = (x:number, y:number, w:number, h:number, label:string, tcls = 'lg mono') =>
  r(x, y + 5, w, h, 'o cs', 8) + r(x, y, w, h, 'o p', 8) + t(x + w / 2, y + h / 2 + 6, label, `${tcls} mid`);
const file = (x:number, y:number, ext:string, cls = 'o p') =>
  paper(x, y, 46, 58, cls) + r(x - 6, y + 30, 40, 16, 'c', 3) + t(x + 14, y + 42, ext, 'xs tw b mid');
function gear(cx:number, cy:number, rad:number, teeth:number, cls = 'o y') {
  const pts:string[] = [];
  for (let i = 0; i < teeth * 4; i++) {
    const a = i / (teeth * 4) * Math.PI * 2, rr = i % 4 < 2 ? rad : rad * .8;
    pts.push(`${n(cx + rr * Math.cos(a))} ${n(cy + rr * Math.sin(a))}`);
  }
  return p(`M${pts.join('L')}z`, cls) + c(cx, cy, rad * .32, 'o p');
}
const cal = (x:number, y:number, w:number, h:number, big:string, small = '') =>
  r(x, y, w, h, 'o p', 6) + p(`M${x} ${y + 20}v-14a6 6 0 0 1 6-6h${w - 12}a6 6 0 0 1 6 6v14z`, 'o c') +
  (small ? t(x + w / 2, y + 14, small, 'xs tw b mid') : '') + t(x + w / 2, y + h / 2 + 18, big, 'xl b mid');
const sheet = (x:number, y:number, cols:number, rows:number, cw = 34, rh = 16) => {
  let s = r(x, y, cols * cw, rows * rh, 'o p', 3) + r(x, y, cols * cw, rh, 'o s', 3);
  for (let i = 1; i < cols; i++) s += p(`M${x + i * cw} ${y}v${rows * rh}`, 'grid');
  for (let j = 1; j < rows; j++) s += p(`M${x} ${y + j * rh}h${cols * cw}`, 'grid');
  return s;
};
const svg = (inner:string) => `<svg viewBox="0 0 360 250" focusable="false" aria-hidden="true">${inner}</svg>`;

/* ---------- los dibujos, por día y por título de diapositiva ---------- */
const drawings:Record<number, Record<string, Drawing>> = {
  1: {
    '5 · Por último, hablemos de tu cuenta': {
      alt:'La ventana de Claude con la barra lateral: abajo a la izquierda, el círculo con tu nombre abre un menú donde está Ajustes.',
      svg:win(20, 18, 320, 214) + p('M20 40h96v192H30a10 10 0 0 1-10-10z', 'o s') + lines(34, 62, 66, 5, 18) +
        lines(140, 66, 170, 3, 16) + r(132, 176, 194, 38, 'o p', 12) + t(146, 200, 'Escribe aquí…', 'sm tm') +
        r(30, 106, 140, 82, 'o p', 10) + r(38, 116, 124, 22, 'y', 5) + t(48, 131, 'Ajustes', 'sm b') + t(48, 156, 'Idioma', 'sm tm') + t(48, 177, 'Cerrar sesión', 'sm tm') +
        c(46, 210, 13, 'o c') + t(46, 214, 'TÚ', 'xs tw b mid') + c(46, 210, 20, 'dash') +
        arrow(236, 120, 176, 128, -14) + t(220, 108, 'el día 5, aquí', 'sm tc hand')
    },
    'Paso 3 · Tu primer prompt: el mapa de tareas': {
      alt:'Una hoja con el prompt y los corchetes por rellenar, un lápiz escribiendo en ellos y Claude contestando con la primera de cinco preguntas.',
      svg:paper(22, 26, 178, 196) + t(38, 60, 'Ayúdame a ordenar', 'sm') + t(38, 78, 'mis tareas de:', 'sm') +
        r(34, 90, 148, 24, 'y', 4) + code(40, 107, '{[}trabajo, casa…{]}', 'sm') + lines(38, 138, 140, 3, 15) +
        g('rotate(-38 176 120)', r(136, 112, 74, 14, 'o y', 2) + p('M136 112l-15 7 15 7z', 'o p') + r(204, 112, 10, 14, 'o c', 2)) +
        r(214, 40, 128, 74, 'o cs', 14) + p('M226 114l-6 16 18-16', 'o cs') + spark(334, 34, 11) +
        t(228, 64, 'Pregunta 1 de 5', 'sm tc b') + t(228, 84, '¿Qué te quita', 'sm') + t(228, 100, 'más tiempo?', 'sm') +
        r(236, 150, 106, 34, 'o p', 14) + t(250, 172, 'El correo…', 'sm') +
        [0, 1, 2, 3, 4].map(i => c(252 + i * 18, 210, 5, i ? 'o p' : 'c')).join('')
    },
    'Tu regalo: el kit de arranque': {
      alt:'Una caja de regalo abierta de la que salen las cuatro piezas del kit: el calendario imprimible, la tarjeta de contexto, el semáforo de datos y los 10 prompts.',
      svg:r(112, 160, 136, 76, 'o c', 3) + r(170, 160, 20, 76, 'y', 0) + p('M112 160h136v76H112z') +
        g('rotate(-6 112 150)', r(100, 136, 160, 24, 'o c', 3) + r(170, 136, 20, 24, 'y', 0) + p('M180 136c-24-22-40-4-12 0M180 136c24-22 40-4 12 0', 'o y')) +
        g('rotate(-10 60 70)', r(26, 30, 64, 72, 'o p', 5) + p('M26 48v-12a6 6 0 0 1 6-6h52a6 6 0 0 1 6 6v12z', 'o c') +
          [0, 1, 2, 3].map(i => [0, 1, 2].map(j => r(33 + i * 13, 56 + j * 14, 9, 9, (i + j) % 3 ? 'cs' : 'y', 2)).join('')).join('')) +
        t(56, 124, 'Calendario', 'xs mid') +
        g('rotate(-4 140 50)', r(110, 22, 78, 50, 'o cs', 6) + lines(120, 38, 56, 3, 11)) + t(149, 92, 'Tarjeta', 'xs mid') +
        r(214, 16, 34, 84, 'o i', 10) + c(231, 33, 9, 'c') + c(231, 58, 9, 'y') + c(231, 83, 9, 'h') + t(231, 114, 'Semáforo', 'xs mid') +
        g('rotate(10 300 70)', r(276, 44, 56, 70, 'o y', 6) + r(270, 38, 56, 70, 'o p', 6) + t(298, 80, '10', 'lg b mid tc') + t(298, 96, 'prompts', 'xs mid')) +
        spark(96, 150, 7, 'y') + spark(272, 146, 9, 'y') + spark(200, 16, 6, 'c')
    }
  },
  2: {
    'Por qué te cuento esto el día 2': {
      alt:'Una conversación con Claude cortada por un aviso de «Has alcanzado el límite de uso», una batería vacía y una persona sorprendida.',
      svg:win(18, 24, 252, 196) + r(130, 56, 126, 26, 'o y', 12) + r(32, 92, 170, 44, 'o s', 12) + lines(44, 108, 140, 2, 13) +
        r(30, 160, 228, 44, 'c', 10) + c(52, 182, 10, 'p') + t(52, 187, '!', 'b tc mid') + t(70, 179, 'Has alcanzado el', 'sm tw b') + t(70, 194, 'límite de uso', 'sm tw b') +
        r(284, 34, 50, 26, 'o p', 5) + r(334, 41, 6, 12, 'i', 2) + r(288, 38, 8, 18, 'c', 2) +
        person(312, 150, 'y') + t(312, 116, '¿¡?!', 'lg b tc mid')
    },
    'Cómo funciona el límite': {
      alt:'Dos contadores: un reloj con una franja de 5 horas que se reinicia (la sesión) y una barra para toda la semana (el tope semanal).',
      svg:c(96, 108, 64) + p('M96 108V44A64 64 0 0 1 128 163.4z', 'y') + c(96, 108, 64, 'o n') +
        Array.from({ length:12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return p(`M${n(96 + 56 * Math.sin(a))} ${n(108 - 56 * Math.cos(a))}L${n(96 + 62 * Math.sin(a))} ${n(108 - 62 * Math.cos(a))}`); }).join('') +
        p('M96 108V68M96 108l26 14', 'o n thick') + c(96, 108, 4, 'i') + arrow(150, 54, 164, 82, -8) +
        t(96, 202, 'Sesión: 5 horas', 'mid') + t(96, 220, 'y vuelve a empezar', 'sm tm mid') +
        t(272, 84, 'Tope semanal', 'mid') + r(204, 100, 140, 28, 'o p', 14) + p('M218 100h80v28h-80a14 14 0 0 1 0-28z', 'cs') + r(204, 100, 140, 28, 'o n', 14) +
        ['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d, i) => t(214 + i * 20, 150, d, 'xs mid tm')).join('') +
        t(272, 202, 'para que no se acabe', 'sm tm mid') + t(272, 220, 'en dos días', 'sm tm mid')
    },
    'Si tienes el gratuito': {
      alt:'Un cronómetro que mide cuánto tarda cada tarea: la sencilla en segundos, la larga mucho más, y un aviso de límite asomando.',
      svg:r(62, 40, 20, 12, 'o i', 3) + c(72, 116, 54) + c(72, 116, 44, 'o s') + p('M72 116V82', 'o n thick') + c(72, 116, 4, 'i') + p('M112 70l10-10', 'o n thick') +
        t(146, 70, 'Tarea sencilla', 'sm') + r(146, 78, 70, 16, 'h', 8) + t(224, 91, '4 s', 'sm b') +
        t(146, 124, 'Tarea larga', 'sm') + r(146, 132, 160, 16, 'y', 8) + t(312, 145, '40 s', 'sm b') +
        r(146, 176, 194, 34, 'o cs', 10) + c(166, 193, 9, 'c') + t(166, 197, '!', 'sm tw b mid') + t(182, 197, '¿Aparece un aviso?', 'sm')
    }
  },
  3: {
    'Seguir la conversación': {
      alt:'Una conversación en la que la respuesta de Claude se va ajustando: «Más corto» y la respuesta encoge, «Más serio» y vuelve a cambiar, sin empezar de cero.',
      svg:spark(26, 34, 10) + r(42, 22, 176, 74, 'o s', 12) + lines(56, 42, 146, 4, 12) +
        r(214, 108, 126, 32, 'o y', 14) + t(277, 129, 'Más corto', 'sm mid') +
        spark(26, 162, 10) + r(42, 150, 130, 44, 'o s', 12) + lines(56, 168, 100, 2, 12) +
        r(214, 204, 126, 32, 'o y', 14) + t(277, 225, 'Más serio', 'sm mid') +
        arrow(222, 92, 248, 104, -6) + arrow(196, 176, 228, 200, -8) + t(250, 70, 'sin empezar', 'xs tc hand') + t(250, 84, 'de cero', 'xs tc hand')
    },
    'El truco más potente: que te pregunte él': {
      alt:'Un mazo de tarjetas de preguntas: Claude te pregunta de una en una, empezando por «¿Para quién es?».',
      svg:g('rotate(9 150 100)', r(70, 40, 180, 96, 'o cs', 10)) + g('rotate(4 150 100)', r(62, 50, 180, 96, 'o y', 10)) +
        g('rotate(-3 150 110)', r(52, 62, 184, 98, 'o p', 10) + t(70, 92, '1 / 5', 'sm tc b') + t(70, 122, '¿Para quién es?', 'lg b') + lines(70, 142, 120, 1)) +
        c(290, 98, 42, 'o y') + t(290, 116, '?', 'xxl b mid tc') + spark(330, 54, 10) +
        t(144, 210, 'de una en una', 'hand tc mid lg') + arrow(214, 202, 262, 146, 18)
    }
  },
  4: {
    'Qué es markdown': {
      alt:'Una hoja de texto escrita en markdown, con # para los títulos, ** para la negrita, guiones para las listas y > para las citas, y las teclas de esos símbolos al lado.',
      svg:paper(22, 14, 214, 222) + code(38, 48, '{#} Lista de la compra', 'b') + code(38, 76, '{##} Mercado', 'sm b') +
        code(38, 98, '{- **}Tomates{**}', 'sm') + code(38, 118, '{-} Pan {*}integral{*}', 'sm') + code(38, 138, '{-} Huevos', 'sm') +
        code(38, 164, '{###} Notas', 'sm b') + code(38, 188, '{>} Ojo: cierra a las 2', 'sm') + code(38, 212, '{---}', 'sm') +
        keycap(256, 22, 40, 38, '#') + keycap(304, 22, 40, 38, '*') + keycap(256, 72, 40, 38, '-') + keycap(304, 72, 40, 38, '>') +
        file(276, 140, '.md') + t(299, 222, 'texto plano', 'xs mid tm')
    },
    'Ventajas para ti, aunque lo tuyo no sea la tecnología': {
      alt:'Una balanza: en el platillo que sube, un archivo .md ligero como una pluma; en el que baja, un documento pesado de Word.',
      svg:p('M150 232h60l-30-20z', 'o i') + p('M180 214V64', 'o n thick') + c(180, 62, 6, 'o y') +
        p('M86 76L274 104', 'o n thick') + p('M86 76l-26 46M86 76l26 46M274 104l-26 46M274 104l26 46', 'o n') +
        p('M54 122h64q-4 18-32 18t-32-18z', 'o y') + p('M242 150h64q-4 18-32 18t-32-18z', 'o y') +
        paper(70, 82, 32, 40) + t(86, 112, '.md', 'xs b mid tc') + p('M110 60q-14 10-22 28M110 60q2 14-14 22', 'o cs') +
        r(246, 106, 56, 44, 'o cs', 4) + r(252, 96, 44, 14, 'o c', 3) + t(274, 136, '.docx', 'xs b mid') +
        t(86, 162, 'ligero', 'sm mid') + t(86, 178, '3 KB', 'xs tm mid') + t(274, 190, 'pesado', 'sm mid') + t(274, 206, '2 MB', 'xs tm mid')
    },
    'Paso 1 · Ábrelo por dentro': {
      alt:'El documento de ejemplo abierto en el Bloc de notas, con una lupa encima de los símbolos # y *.',
      svg:win(16, 16, 300, 214, 'ejemplo.md — Bloc de notas') + code(32, 64, '{#} Viaje a Lisboa', 'b') + code(32, 92, '{##} Lo que no se nos…', 'sm') +
        code(32, 116, '{- **}Pasaportes{**}', 'sm') + code(32, 138, '{-} Cargador del móvil', 'sm') + code(32, 162, '{|} Vuelos {|} 240 € {|}', 'sm') +
        code(32, 190, '{>} Ojo: el museo cierra…', 'sm') +
        c(266, 138, 40, 'o lens') + t(266, 152, '# *', 'xl mono b mid tc') + p('M294 167l34 34', 'o n handle')
    },
    'Paso 2 · Míralo por fuera': {
      alt:'El mismo texto con sus dos caras: a la izquierda, por dentro, con # y **; a la derecha, por fuera, con un título grande y negritas.',
      svg:t(84, 30, 'por dentro', 'sm tm mid') + paper(14, 42, 142, 178) + code(28, 72, '{#} Lisboa', 'b') + code(28, 100, '{##} Maleta', 'sm') +
        code(28, 124, '{- **}Pasaportes{**}', 'xs') + code(28, 144, '{-} Cargador', 'xs') + code(28, 170, '{>} Ojo: lunes', 'xs') +
        arrow(162, 128, 198, 128, -16) + spark(180, 96, 9) +
        t(276, 30, 'por fuera', 'sm tm mid') + r(204, 42, 142, 178, 'o p', 8) + t(218, 76, 'Lisboa', 'xl b') + t(218, 104, 'Maleta', 'b') +
        c(222, 122, 3, 'i') + t(230, 126, 'Pasaportes', 'sm b') + c(222, 143, 3, 'i') + t(230, 147, 'Cargador', 'sm reg') +
        r(214, 160, 4, 26, 'c', 1) + t(226, 177, 'Ojo: lunes', 'sm hand')
    },
    'Paso 3 · Pasa tus notas a markdown': {
      alt:'Una nota adhesiva con apuntes desordenados se convierte en una hoja ordenada en markdown, con títulos y listas.',
      svg:g('rotate(-7 90 120)', r(18, 40, 140, 150, 'o y', 4) + t(32, 72, 'compra pan!!', 'hand') + t(46, 98, 'llamar Ana (mar?)', 'sm hand') +
        t(30, 126, 'idea: web…', 'hand') + p('M30 140q20-8 40 0t40 0', 'o n') + t(60, 170, 'presu ¿?', 'sm hand') + p('M120 60l20 20M140 60l-20 20', 'o n')) +
        arrow(168, 112, 200, 112, -16) + spark(184, 82, 9) +
        paper(206, 30, 140, 196) + code(218, 60, '{#} Mis notas', 'b') + code(218, 88, '{##} Compras', 'sm') + code(218, 108, '{-} Pan', 'sm') +
        code(218, 134, '{##} Llamadas', 'sm') + code(218, 154, '{-} Ana, martes', 'sm') + code(218, 180, '{##} Ideas', 'sm') + code(218, 200, '{-} Web', 'sm')
    },
    'Paso 4 · Llévatelo como archivo': {
      alt:'Un archivo .md que baja a la carpeta de descargas, y un calendario que recuerda que lo usarás el día 8.',
      svg:paper(70, 18, 100, 126) + lines(86, 48, 64, 5, 14) + r(62, 102, 56, 24, 'c', 4) + t(90, 119, '.md', 'b tw mid') +
        arrow(120, 150, 120, 176, 0) +
        p('M36 182h60l10 10h112v44H36z', 'o y') + p('M36 200h182', 'o n') + t(127, 226, 'Descargas', 'sm mid') +
        cal(254, 50, 80, 86, '8', 'DIC') + t(294, 160, 'lo usarás', 'sm tc hand mid') + t(294, 176, 'el día 8', 'sm tc hand mid')
    }
  },
  5: {
    'Paso 1 · Elige qué quieres': {
      alt:'Las tres fuentes de ideas para tu mini-app: una libreta, las notas del móvil y algo que llevas en la cabeza.',
      svg:g('rotate(-6 70 120)', r(24, 54, 92, 120, 'o p', 6) + [0, 1, 2, 3, 4, 5].map(i => c(24, 70 + i * 18, 5, 'o s')).join('') + lines(40, 84, 62, 5, 16)) +
        r(140, 36, 76, 144, 'o i', 14) + r(146, 50, 64, 114, 'p', 4) + t(152, 68, 'Notas', 'sm b') + [0, 1, 2].map(i => c(156, 88 + i * 22, 5, 'o n') + lines(166, 88 + i * 22, 36, 1)).join('') +
        person(290, 176, 'y') + c(290, 84, 34, 'o p') + c(250, 144, 5, 'o p') + c(260, 128, 8, 'o p') +
        p('M276 66l8 8 16-18', 'o n thick') + t(290, 102, '¿y si…?', 'sm mid hand') +
        t(180, 234, 'algo pequeño', 'lg tc hand mid')
    },
    'Paso 2 · Pídela bien': {
      alt:'Un puzle de cuatro piezas con lo que debe llevar el prompt: qué necesitas, quién la usa, qué debe hacer y qué hacer si duda.',
      svg:r(70, 24, 106, 96, 'o y', 4) + r(176, 24, 106, 96, 'o cs', 4) + r(70, 120, 106, 96, 'o hs', 4) +
        c(176, 72, 13, 'o y') + c(123, 120, 13, 'o y') + c(229, 120, 13, 'o cs') +
        g('translate(18 12) rotate(7 229 168)', r(176, 120, 106, 96, 'o p', 4) + t(229, 162, 'Qué hacer', 'sm mid b') + t(229, 180, 'si duda', 'sm mid b')) +
        t(123, 64, 'Qué', 'sm mid b') + t(123, 82, 'necesitas', 'sm mid b') + t(229, 64, 'Quién', 'sm mid b') + t(229, 82, 'la usa', 'sm mid b') +
        t(123, 162, 'Qué debe', 'sm mid b') + t(123, 180, 'hacer', 'sm mid b') + arrow(330, 236, 304, 212, 8)
    },
    'Paso 3 · Úsala de verdad': {
      alt:'Una mini-app con un campo de texto y dos botones; el cursor pulsa uno, y una nota adhesiva apunta «este botón no se entiende».',
      svg:win(18, 22, 240, 208, 'Mi mini-app') + t(36, 72, 'Gasto de hoy', 'sm b') + r(36, 82, 204, 30, 'o s', 6) + t(48, 102, '12,50 €', 'sm') +
        r(36, 128, 96, 32, 'c', 8) + t(84, 149, 'Añadir', 'sm tw b mid') + r(144, 128, 96, 32, 'o s', 8) + t(192, 149, '¿Ajustar?', 'sm mid') +
        t(36, 192, 'Total: 37,50 €', 'b') + p('M200 150l0 34 9-8 7 15 7-3-7-15 12-1z', 'o p') +
        g('rotate(6 300 110)', r(254, 56, 94, 98, 'o y', 3) + t(266, 86, 'Este botón', 'sm hand') + t(266, 104, 'no se', 'sm hand') + t(266, 122, 'entiende', 'sm hand')) +
        arrow(262, 136, 244, 146, 6)
    }
  },
  6: {
    'La cara B': {
      alt:'Dos respuestas de Claude con el mismo tono seguro: una es correcta y la otra da un plazo el 31 de junio, que no existe.',
      svg:spark(28, 56, 11) + r(46, 28, 234, 58, 'o s', 14) + t(62, 54, '¡Claro! El 15 % de 80', 'sm') + t(62, 72, 'es 12.', 'sm b') + check(298, 57, 15) +
        spark(28, 160, 11) + r(46, 132, 234, 58, 'o s', 14) + t(62, 158, '¡Claro! El plazo vence', 'sm') + t(62, 176, 'el 31 de junio.', 'sm b') + cross(298, 161, 15) +
        t(180, 116, 'mismo tono, mismo aplomo', 'sm tc hand mid') + t(180, 224, 'junio tiene 30 días', 'sm tm mid')
    },
    'Dónde falla más': {
      alt:'Seis viñetas con los puntos flacos de la IA: cuentas, fechas, datos que cambian, citas y fuentes, documentos largos y nombres parecidos.',
      svg:[['Cuentas', 14, 18], ['Fechas', 128, 18], ['Datos que cambian', 242, 18], ['Citas', 14, 132], ['Doc. largos', 128, 132], ['Nombres', 242, 132]]
        .map(([label, x, y]) => r(x as number, y as number, 104, 104, 'o p', 10) + t((x as number) + 52, (y as number) + 94, label as string, 'xs mid b')).join('') +
        t(66, 66, '2+2=5', 'lg b mid mono') + cross(98, 40, 8) +
        cal(156, 30, 48, 50, '31', 'JUN') +
        g('rotate(-12 294 60)', p('M266 42h44l14 18-14 18h-44z', 'o y') + c(276, 60, 4, 'o p') + t(298, 66, '€?', 'sm b mid')) + arrow(324, 76, 330, 48, 0) +
        r(42, 146, 46, 54, 'o cs', 3) + p('M52 146v54', 'o n') + t(70, 182, '?', 'lg b mid tc') +
        r(158, 144, 44, 56, 'o p', 3) + p('M164 154h32M164 162h32', 'ln') + p('M164 172h32M164 178h28', 'ln faint') + p('M164 188h32', 'ln') +
        person(272, 156, 'y') + person(310, 156, 'cs') + t(272, 196, 'Ana', 'xs mid') + t(310, 196, 'Ane', 'xs mid')
    },
    'Las tres preguntas': {
      alt:'Una lupa sobre una respuesta y tres etiquetas colgadas: ¿De dónde sale esto?, ¿Qué has dado por supuesto? y ¿Qué puede estar mal?',
      svg:paper(18, 42, 110, 150) + lines(32, 74, 76, 6, 16) + c(84, 128, 34, 'o lens') + p('M108 152l30 30', 'o n handle') +
        [['¿De dónde sale esto?', 26], ['¿Qué has supuesto?', 98], ['¿Qué puede estar mal?', 170]].map(([q, y], i) =>
          p(`M160 ${(y as number) + 4}l14-14h170v52H174z`, i === 1 ? 'o y' : 'o p') + c(176, (y as number) + 4, 4, 'o s') + t(190, (y as number) + 10, q as string, 'sm b')).join('') +
        p('M128 80q20-60 46-66M128 120q20 0 46-26M128 150q20 10 46 24', 'o n dash')
    },
    'La frase del día': {
      alt:'Una bola de cristal tachada (la IA no es un oráculo) frente a una compañera que te pasa un borrador y tú lo revisas con un bolígrafo.',
      svg:c(84, 104, 48, 'o lens') + p('M60 84q10-14 26-16', 'o n') + p('M48 166h72l-10-18H58z', 'o c') + cross(132, 60, 14) +
        t(84, 202, 'oráculo', 'mid strike') + p('M54 198h60', 'o n') +
        spark(202, 92, 12) + paper(226, 50, 82, 110) + lines(240, 82, 52, 5, 15) + check(296, 150, 13) +
        g('rotate(35 320 120)', r(300, 100, 54, 10, 'o i', 2) + p('M300 100l-10 5 10 5z', 'o p')) +
        t(268, 202, 'tú la revisas', 'mid')
    }
  },
  7: {
    'Paso 5 · Abre tu primer chat dentro': {
      alt:'Una carpeta de proyecto con las instrucciones y los archivos dentro; delante, un chat nuevo que ya los tiene en la cabeza.',
      svg:p('M28 44h90l14 16h200v170H28z', 'o y') + t(40, 38, 'Mi proyecto', 'sm b') +
        g('rotate(-5 120 80)', r(64, 52, 100, 80, 'o p', 4) + t(74, 72, 'Instrucciones', 'xs b') + lines(74, 88, 76, 2, 12)) +
        g('rotate(4 240 80)', file(192, 46, '.pdf') + file(250, 52, '.md')) +
        p('M28 112h304v118H28z', 'o y') + r(52, 130, 256, 82, 'o p', 12) + spark(76, 154, 10) + t(94, 158, '¿En qué te ayudo con', 'sm') +
        t(94, 176, 'tu proyecto?', 'sm') + r(68, 186, 224, 18, 'o s', 9)
    },
    'Encontrarlo': {
      alt:'La barra lateral de Claude con «Proyectos» resaltado y los proyectos marcados con estrella colocados arriba del todo.',
      svg:r(32, 16, 190, 218, 'o s', 10) + t(52, 46, 'Nuevo chat', 'sm tm') + t(52, 72, 'Chats', 'sm tm') + r(42, 84, 170, 26, 'y', 6) + t(52, 102, 'Proyectos', 'sm b') +
        p('M42 124h170', 'grid') + [['Mi trabajo', true], ['Oposiciones', true], ['Casa', false], ['Viaje', false]].map(([name, star], i) =>
          (star ? star5(60, 146 + i * 24, 7, 'y') : c(60, 146 + i * 24, 3, 'i')) + t(76, 151 + i * 24, name as string, 'sm')).join('') +
        star5(286, 104, 40, 'o y') + arrow(276, 166, 226, 158, -10) + t(286, 196, 'las que más', 'sm tc hand mid') + t(286, 212, 'usas, arriba', 'sm tc hand mid')
    },
    'Mover un chat a un proyecto': {
      alt:'Un chat suelto con el menú de los tres puntos abierto en «Mover a proyecto» y una flecha que lo lleva a la carpeta del proyecto.',
      svg:r(18, 48, 168, 104, 'o p', 10) + t(32, 74, 'Chat suelto', 'b') + lines(32, 96, 120, 3, 14) + c(166, 66, 12, 'o s') + t(166, 70, '···', 'sm b mid') +
        r(110, 92, 136, 64, 'o p', 8) + r(116, 100, 124, 22, 'y', 5) + t(124, 115, 'Mover a proyecto', 'sm b') + t(124, 143, 'Eliminar', 'sm tm') +
        arrow(170, 168, 258, 186, 30, 'arw dash2') + p('M240 166h40l8 10h52v58H240z', 'o y') + t(290, 216, 'Proyecto', 'sm mid b')
    }
  },
  8: {
    'Hoy es festivo, así que hoy toca el experimento bueno': {
      alt:'Dos matraces de laboratorio, A y B, idénticos salvo en una cosa: a B le cae una gota extra de contexto.',
      svg:p('M20 222h320', 'o n thick') + flask(100, 'cs') + t(100, 168, 'A', 'xl b mid') + flask(250, 'y') + t(250, 168, 'B', 'xl b mid') +
        g('rotate(25 300 40)', r(292, 10, 14, 50, 'o p', 3) + p('M292 60h14l-7 14z', 'o p')) + p('M278 82q-6 10 0 14q6-4 0-14z', 'c') +
        t(180, 30, 'solo cambia', 'tc hand mid') + t(180, 48, 'una cosa', 'tc hand mid') + arrow(222, 46, 268, 80, -14)
    },
    'Paso 1 · Crea el proyecto A (contexto pobre)': {
      alt:'La carpeta «Prueba A» casi vacía, con una sola hoja de dos líneas, y un indicador de contexto con la aguja en «poco».',
      svg:p('M20 60h80l14 16h110v150H20z', 'o cs') + t(30, 54, 'Prueba A · contexto pobre', 'sm b') +
        g('rotate(-4 120 140)', r(70, 98, 100, 110, 'o p', 4) + lines(84, 124, 60, 2, 14)) +
        p('M232 172a54 54 0 0 1 108 0', 'o n thick') + p('M232 172a54 54 0 0 1 15.8-38.2', 'arw thick') +
        p('M286 172L250 148', 'o n thick') + c(286, 172, 6, 'i') + t(240, 196, 'poco', 'sm tc b mid') + t(330, 196, 'mucho', 'sm tm mid') + t(286, 104, 'contexto', 'sm mid')
    },
    'Paso 5 · Saca tu conclusión': {
      alt:'Las dos respuestas comparadas: la del proyecto A dice «depende» con vaguedades; la del proyecto B es concreta y está marcada como útil.',
      svg:c(180, 34, 16, 'o y') + p('M174 52h12v8h-12z', 'o p') + p('M172 30l8 8 8-8', 'o n') +
        r(18, 72, 150, 156, 'o p', 10) + c(40, 92, 12, 'o cs') + t(40, 97, 'A', 'sm b mid') + t(32, 132, 'Depende de', 'sm tm') + t(32, 150, 'muchos factores…', 'sm tm') + lines(32, 172, 110, 3, 14, 'ln faint') +
        r(192, 72, 150, 156, 'o p', 10) + c(214, 92, 12, 'o y') + t(214, 97, 'B', 'sm b mid') +
        [0, 1, 2].map(i => check(216, 130 + i * 28, 8) + lines(232, 130 + i * 28, 90, 1)).join('') + t(206, 218, '¡Esto me sirve!', 'sm tc hand')
    }
  },
  9: {
    'Las cuatro preguntas antes de conectar nada': {
      alt:'Un enchufe sin conectar a la toma, en pausa, rodeado de las cuatro preguntas: qué puede ver, si lee o actúa, dónde se quita y si hay alguna norma.',
      svg:p('M18 128h70', 'o n thick') + r(88, 110, 50, 36, 'o y', 6) + p('M138 120h18M138 136h18', 'o n thick') +
        r(208, 100, 56, 56, 'o p', 10) + r(222, 116, 6, 12, 'i', 2) + r(244, 116, 6, 12, 'i', 2) + p('M264 128h80', 'o n thick') +
        t(182, 136, '?', 'xl b tc mid') +
        pill(14, 24, 150, '¿Qué puede ver?', 'o p') + pill(196, 24, 150, '¿Lee o actúa?', 'o y') +
        pill(14, 196, 150, '¿Dónde se quita?', 'o y') + pill(196, 196, 150, '¿Hay alguna norma?', 'o p')
    },
    'El reto de hoy (cinco minutos)': {
      alt:'El directorio de conectores con varias apps; una ficha abierta con el botón «Conectar» y un aviso de «todavía no».',
      svg:win(14, 18, 206, 214, 'Conectores') + [0, 1, 2].map(i => [0, 1, 2].map(j => r(30 + i * 60, 56 + j * 56, 46, 44, j === 0 && i === 0 ? 'o y' : 'o s', 10)).join('')).join('') +
        cal(38, 62, 30, 32, '', '') + envelope(96, 68, 30, 20) + p('M154 68h12l4 5h12v18h-28z', 'o cs') +
        r(196, 58, 150, 168, 'o p', 12) + t(212, 84, 'Calendario', 'b') + lines(212, 106, 116, 3, 14) +
        r(212, 154, 118, 32, 'c', 8) + t(271, 175, 'Conectar', 'sm tw b mid') + p('M196 196l130-62', 'o n stop') +
        t(256, 214, 'todavía no', 'sm tc hand mid') + p('M318 166l0 30 8-7 6 13 6-3-6-13 11-1z', 'o p')
    }
  },
  10: {
    'Paso 5 · Enciéndelo en un chat': {
      alt:'El menú de conectores de un chat: Google Calendar con el interruptor encendido y los demás apagados.',
      svg:r(46, 14, 268, 166, 'o p', 12) + t(64, 40, 'Conectores', 'b') +
        [['Google Calendar', true], ['Gmail', false], ['Google Drive', false]].map(([name, on], i) =>
          r(64, 56 + i * 40, 24, 24, on ? 'o y' : 'o s', 6) + t(100, 73 + i * 40, name as string, on ? 'sm b' : 'sm tm') + toggle(256, 58 + i * 40, on as boolean)).join('') +
        r(18, 196, 324, 40, 'o p', 14) + c(42, 216, 12, 'o y') + t(42, 221, '+', 'b mid') + t(64, 221, 'Nuevo chat…', 'sm tm') + arrow(40, 192, 60, 168, 8)
    },
    'Paso 7 · Pídele cuentas': {
      alt:'La respuesta de Claude con tus citas al lado de tu Google Calendar: una coincide y la otra se revisa con lupa.',
      svg:spark(26, 34, 10) + r(14, 50, 150, 136, 'o s', 12) + t(28, 76, 'Esta semana:', 'sm b') +
        t(28, 104, 'Mar 10:00', 'xs b') + t(28, 120, 'Dentista', 'sm') + t(28, 148, 'Jue 17:30', 'xs b') + t(28, 164, 'Reunión', 'sm') +
        r(202, 32, 144, 172, 'o p', 8) + p('M202 54h144', 'o n') + ['L', 'M', 'X', 'J', 'V'].map((d, i) => t(216 + i * 28, 48, d, 'xs mid b')).join('') +
        [1, 2, 3, 4].map(i => p(`M${202 + i * 28.8} 54v150`, 'grid')).join('') + r(234, 70, 26, 34, 'y', 4) + r(292, 140, 26, 34, 'cs', 4) +
        p('M100 112L234 86M90 156L292 156', 'o n dash') + check(170, 98, 10) + c(176, 196, 18, 'o lens') + p('M189 209l14 14', 'o n handle') + t(176, 202, '?', 'b mid tc')
    },
    'La idea que se queda': {
      alt:'Tres puertas: dos cerradas con candado y la del medio con una llave en la cerradura; tú decides cuándo se abre y cuándo devuelves la llave.',
      svg:p('M14 220h332', 'o n thick') +
        r(28, 74, 76, 146, 'o s', 4) + padlock(66, 150) + r(256, 74, 76, 146, 'o s', 4) + padlock(294, 150) +
        r(142, 74, 76, 146, 'o i', 4) + p('M142 74l50 10v146l-50-10z', 'o y') + c(180, 152, 4, 'i') +
        g('rotate(-20 214 150)', c(222, 150, 12, 'o y') + c(222, 150, 4, 'o p') + p('M210 150h-26v8M196 150v6', 'o n thick')) +
        t(180, 52, 'Calendario', 'sm b mid') + t(180, 244, 'tú decides', 'sm tc hand mid')
    }
  },
  11: {
    'Paso 1 · ¿Quién me espera?': {
      alt:'Tu bandeja con tres correos esperando respuesta, cada uno con los días que lleva esperando, y debajo el recuadro de las búsquedas que ha hecho Claude.',
      svg:[['Lucía · presupuesto', '3 días'], ['Gestoría · IVA', '5 días'], ['Mario · reunión', '1 día']].map(([who, wait], i) =>
        r(18, 18 + i * 50, 324, 40, 'o p', 8) + c(42, 38 + i * 50, 11, i === 1 ? 'o c' : 'o cs') + t(62, 43 + i * 50, who, 'sm b') +
        r(264, 26 + i * 50, 66, 24, i === 1 ? 'c' : 'y', 12) + t(297, 42 + i * 50, wait, i === 1 ? 'xs tw b mid' : 'xs b mid')).join('') +
        r(18, 180, 324, 52, 'o hs', 10) + t(32, 200, 'Uso de herramienta', 'xs b') + code(32, 220, 'buscar: {sin respuesta}, últimos 14 días', 'xs')
    },
    'Paso 3 · Busca algo en tu Drive': {
      alt:'Un archivador con un cajón abierto y una lupa que encuentra el documento que buscabas.',
      svg:r(26, 52, 130, 180, 'o s', 6) + r(38, 66, 106, 44, 'o p', 4) + r(78, 82, 26, 8, 'o i', 4) + r(38, 178, 106, 44, 'o p', 4) + r(78, 194, 26, 8, 'o i', 4) +
        r(50, 116, 130, 54, 'o p', 4) + r(100, 136, 26, 8, 'o i', 4) + p('M58 116v-14h10v14M76 116v-18h10v18', 'o cs') +
        g('rotate(-8 260 90)', paper(206, 36, 112, 128) + t(220, 68, 'Contrato', 'b') + t(220, 86, 'alquiler.pdf', 'xs tm') + lines(220, 108, 80, 3, 14)) +
        c(290, 164, 34, 'o lens') + p('M314 188l26 26', 'o n handle') + check(290, 164, 14) + arrow(184, 112, 206, 96, -6)
    },
    'La idea que se queda': {
      alt:'Antes: tú le cuentas las cosas a Claude. Ahora: Claude va a buscarlas a tu correo y a tus documentos.',
      svg:t(90, 24, 'Antes', 'b mid') + t(270, 24, 'Ahora', 'b mid') + p('M180 12v226', 'o n dash') +
        person(44, 168, 'y') + r(14, 50, 148, 70, 'o p', 14) + p('M40 120l2 16 16-16', 'o p') + lines(28, 72, 118, 3, 14) + spark(140, 170, 14) +
        spark(240, 136, 14) + envelope(292, 46, 50, 34) + paper(296, 168, 42, 54) + arrow(258, 122, 290, 80, -8) + arrow(258, 150, 292, 188, 8) +
        t(270, 240, 'lo va a buscar', 'sm tc hand mid')
    }
  },
  12: {
    'Qué es eso de las palabras clave': {
      alt:'Una tecla con la palabra MENÚ que, al pulsarla, despliega el menú de toda la semana.',
      svg:keycap(20, 82, 130, 62, 'MENÚ', 'xl b') + p('M30 64l-10-14M85 58V40M140 64l10-14', 'o n') +
        arrow(160, 116, 200, 116, -14) +
        paper(208, 18, 136, 214) + t(222, 46, 'Menú semanal', 'sm b') +
        ['L lentejas', 'M crema y tortilla', 'X pasta', 'J pescado', 'V pizza casera'].map((s, i) => t(222, 76 + i * 30, s.slice(0, 1), 'sm b tc') + t(238, 76 + i * 30, s.slice(2), 'xs')).join('') +
        t(85, 186, 'un atajo', 'tc hand mid') + t(85, 204, 'de encargos', 'tc hand mid')
    },
    'Paso 5 · Pruébalo': {
      alt:'En el chat del proyecto escribes TEST y Claude responde con un test de opción múltiple, tal como dice la plantilla.',
      svg:r(214, 18, 128, 36, 'o y', 16) + t(278, 42, 'TEST', 'b mono mid') +
        spark(28, 86, 11) + r(46, 70, 238, 162, 'o s', 14) + t(62, 98, '1. ¿Qué es un tributo?', 'sm b') +
        [['a) Un impuesto', false], ['b) Una tasa', true], ['c) Las dos', false]].map(([o, ok], i) =>
          c(72, 124 + i * 30, 8, ok ? 'o h' : 'o p') + (ok ? p(`M68 ${124 + i * 30}l3 3 6-6`, 'w3') : '') + t(88, 129 + i * 30, o as string, 'sm')).join('') +
        t(62, 220, '2. …', 'sm tm') + paper(296, 90, 54, 66) + t(323, 122, 'TEST', 'xs b mid') + t(323, 138, '= test', 'xs mid tm') + arrow(318, 64, 318, 86, 0)
    },
    'Paso 6 · Sube tus documentos': {
      alt:'Los documentos pasan por un semáforo antes de entrar en la carpeta del proyecto: los apuntes y la plantilla pasan; el DNI se queda fuera.',
      svg:file(20, 30, '.pdf') + file(20, 108, '.md') + g('rotate(-8 50 210)', r(16, 180, 66, 44, 'o cs', 4) + t(49, 208, 'DNI', 'b mid')) + cross(86, 196, 11) +
        r(140, 44, 34, 92, 'o i', 10) + c(157, 62, 10, 'cs') + c(157, 90, 10, 'cs') + c(157, 118, 10, 'h') + p('M157 136v96', 'o n thick') +
        arrow(84, 66, 136, 82, -6) + arrow(84, 136, 136, 104, 6) + arrow(180, 92, 228, 116, -8) +
        p('M220 110h50l10 12h66v108H220z', 'o y') + g('rotate(-6 260 120)', r(238, 96, 44, 52, 'o p', 3)) + g('rotate(5 300 120)', r(286, 100, 44, 52, 'o p', 3)) +
        p('M220 146h126v84H220z', 'o y') + t(283, 194, 'Proyecto', 'sm b mid')
    },
    'La idea que se queda': {
      alt:'Una rueda de ajustes que se configura una vez, cien marcas de uso y un calendario que te recuerda revisarlo cada pocos meses.',
      svg:gear(80, 96, 54, 9) + t(80, 186, 'se configura', 'sm mid') + t(80, 204, '1 vez', 'lg b mid tc') +
        Array.from({ length:5 }, (_, k) => [0, 1, 2, 3].map(i => p(`M${168 + k * 36 + i * 6} 56v34`, 'o n')).join('') + p(`M${164 + k * 36} 84l26-22`, 'o n')).join('') +
        Array.from({ length:5 }, (_, k) => [0, 1, 2, 3].map(i => p(`M${168 + k * 36 + i * 6} 102v34`, 'o n faint')).join('')).join('') +
        t(250, 162, 'se usa ×100', 'lg b mid') + cal(270, 180, 60, 60, '↻', '') + t(234, 222, 'revisión', 'xs mid tm')
    }
  },
  13: {
    'Paso 2 · Ajusta': {
      alt:'El esquema de la presentación en tarjetas: una se tacha, otra sube de posición y se añade una nueva.',
      svg:[['1', 'Portada'], ['2', 'El problema'], ['3', 'Historia larga'], ['4', 'Las cifras'], ['5', 'Qué pedimos']].map(([num, label], i) =>
        r(40, 16 + i * 44, 200, 36, i === 3 ? 'o y' : 'o p', 8) + t(56, 39 + i * 44, num, 'sm b tc') + t(76, 39 + i * 44, label, 'sm')).join('') +
        p('M70 122h150', 'o n strikeline') + arrow(248, 162, 248, 82, -26) + t(300, 124, 'antes', 'sm tc hand mid') +
        r(270, 186, 76, 36, 'o hs dashbox', 8) + t(308, 209, '+ Cierre', 'sm b mid')
    },
    'Paso 5 · Comprueba las cifras': {
      alt:'La diapositiva dice 12.400 € y se comprueba contra la celda de la hoja de ventas y con la calculadora.',
      svg:r(14, 22, 196, 116, 'o p', 8) + t(30, 50, 'Ventas del trimestre', 'sm b') + t(30, 82, '12.400 €', 'xl b tc') +
        [0, 1, 2, 3].map(i => r(30 + i * 28, 122 - [20, 28, 18, 34][i], 18, [20, 28, 18, 34][i], i === 3 ? 'c' : 'cs', 2)).join('') +
        sheet(14, 166, 5, 4) + r(116, 198, 34, 16, 'y', 2) + t(133, 210, '12.400', 'xxs mid b') +
        p('M110 92q60 50 24 104', 'o n dash') +
        r(250, 70, 96, 150, 'o i', 12) + r(262, 84, 72, 30, 'p', 4) + t(326, 105, '12.400', 'sm b end') +
        [0, 1, 2].map(i => [0, 1, 2].map(j => r(264 + i * 24, 126 + j * 26, 18, 18, 'cs', 4)).join('')).join('') + check(334, 70, 14)
    },
    'La idea que se queda': {
      alt:'Claude apila las diapositivas y tú, con un sello de «Revisado», decides qué se cuenta y compruebas que sea verdad.',
      svg:spark(40, 50, 16) + t(40, 90, 'Claude monta', 'sm mid') +
        g('rotate(-4 160 180)', r(90, 172, 150, 50, 'o cs', 6)) + g('rotate(3 160 140)', r(96, 130, 150, 50, 'o y', 6)) + r(100, 86, 150, 50, 'o p', 6) + lines(114, 106, 100, 2, 14) +
        g('rotate(-14 300 70)', r(276, 26, 46, 40, 'o i', 6) + r(270, 64, 58, 14, 'o c', 3)) +
        g('rotate(-10 200 112)', r(150, 96, 96, 32, 'stamp', 4) + t(198, 118, 'REVISADO', 'sm b mid tc')) +
        t(300, 110, 'tú decides', 'sm mid') + t(300, 126, 'y compruebas', 'sm mid')
    }
  },
  14: {
    'Paso 2 · Pregúntalo sin pedir nada': {
      alt:'Una respuesta bien redactada que suena fiable pero no trae ni un enlace, con la búsqueda web apagada y una nota que pregunta «¿fuente?».',
      svg:r(14, 20, 230, 158, 'o p', 12) + spark(34, 44, 10) + lines(30, 70, 196, 6, 16) + spark(214, 34, 6, 'y') + spark(230, 50, 4, 'y') +
        r(14, 196, 210, 38, 'o s', 10) + t(28, 220, 'Búsqueda web', 'sm') + toggle(172, 205, false) +
        g('rotate(8 300 110)', r(250, 70, 96, 90, 'o cs', 3) + t(298, 124, '¿fuente?', 'b mid tc hand'))
    },
    'Paso 5 · Que se juzgue a sí mismo': {
      alt:'Tres fuentes con su etiqueta: una web oficial con sello, un periódico y un blog de opinión con un megáfono.',
      svg:[['Web oficial', 'Oficial', 'o h', 'xs tw b mid'], ['Periódico', 'Medio', 'o y', 'xs b mid'], ['Blog personal', 'Opinión', 'o cs', 'xs b mid']].map(([name, badge, bc, tc], i) =>
        r(14, 22 + i * 74, 332, 60, 'o p', 10) + p(`M34 ${44 + i * 74}a8 8 0 0 1 8-8h8M50 ${60 + i * 74}h-8a8 8 0 0 1 0-16`, 'o n') + p(`M44 ${52 + i * 74}h10`, 'o n') +
        t(70, 49 + i * 74, name, 'sm b') + lines(70, 64 + i * 74, 120, 1) + r(256, 38 + i * 74, 76, 28, bc, 14) + t(294, 56 + i * 74, badge, tc)).join('') +
        c(222, 52, 10, 'o h') + p('M218 52l3 3 5-6', 'w3') + p('M210 196l18-10v26l-18-10h-6v-6z', 'o c')
    },
    'La frase del día': {
      alt:'Una cita elegante con unas comillas grandes y, abajo, un eslabón de cadena roto: sin fuente, es solo una opinión bien redactada.',
      svg:r(24, 22, 312, 150, 'o s', 14) + t(48, 92, '“', 'quote tc') + lines(92, 66, 210, 4, 22) + t(306, 168, '”', 'quote tc') +
        g('rotate(-20 130 206)', r(102, 194, 48, 24, 'o n thick', 12)) + g('rotate(-20 200 206)', r(186, 186, 48, 24, 'o n thick', 12)) +
        p('M164 184l-6-12M170 214l6 12M156 204l-12 2', 'o n') + t(278, 214, 'sin fuente', 'sm tc hand mid')
    }
  },
  15: {
    'Paso 1 · Descarga los dos archivos': {
      alt:'Dos hojas de cálculo, ventas y facturas, con un lío de flechas entre ellas y un reloj: cruzarlas a mano llevaría horas.',
      svg:sheet(14, 50, 4, 8, 30) + t(74, 40, 'ventas.xlsx', 'sm b mid') + sheet(226, 50, 4, 8, 30) + t(286, 40, 'facturas.xlsx', 'sm b mid') +
        p('M134 70C180 70 180 160 226 160M134 100C180 100 180 80 226 80M134 140C190 140 170 120 226 118M134 180C180 180 180 100 226 100', 'arw thin') +
        c(180, 210, 24, 'o y') + p('M180 210v-14M180 210l10 6', 'o n thick') + t(232, 222, '¿horas?', 'tc hand')
    },
    'Paso 2 · El diagnóstico de los datos': {
      alt:'Una hoja de cálculo con un fonendoscopio encima que detecta lo sucio: una fila duplicada, una celda vacía y una fecha imposible.',
      svg:sheet(14, 30, 5, 9, 38, 20) + r(15, 91, 188, 18, 'cs', 0) + r(15, 111, 188, 18, 'cs', 0) + t(206, 126, '×2', 'sm b tc') +
        r(91, 151, 36, 18, 'y', 0) + t(109, 164, '—', 'sm b mid') + r(129, 191, 36, 18, 'c', 0) + t(147, 204, '32/13', 'xxs tw b mid') +
        p('M300 30v40q0 50-50 60q-44 6-40-20', 'o n thick') + p('M330 30v40q0 50-30 60', 'o n thick') + c(300, 26, 5, 'i') + c(330, 26, 5, 'i') +
        c(212, 108, 16, 'o y') + c(212, 108, 7, 'o p')
    },
    'Paso 3 · Decide tú qué hacer con lo sucio': {
      alt:'Un panel de decisiones: para los duplicados eliges «Quitar» y para las facturas sin importe, «Marcar». El criterio es tuyo.',
      svg:r(14, 20, 260, 210, 'o p', 12) + t(32, 50, '¿Qué hago con…?', 'b') +
        t(32, 86, 'Duplicados', 'sm b') + r(32, 96, 100, 30, 'o h', 8) + t(82, 116, 'Quitar', 'sm tw b mid') + r(144, 96, 100, 30, 'o s', 8) + t(194, 116, 'Dejar', 'sm mid') +
        t(32, 158, 'Facturas sin importe', 'sm b') + r(32, 168, 100, 30, 'o s', 8) + t(82, 188, 'Ignorar', 'sm mid') + r(144, 168, 100, 30, 'o h', 8) + t(194, 188, 'Marcar', 'sm tw b mid') +
        p('M226 190l0 30 8-7 6 13 6-3-6-13 11-1z', 'o p') + person(312, 160, 'y') + t(312, 230, 'tu criterio', 'sm tc hand mid')
    },
    'Paso 4 · El cruce y el informe': {
      alt:'Las dos hojas se cruzan y salen convertidas en un informe de una página, con un gráfico y un titular para leer en cinco minutos.',
      svg:sheet(14, 24, 3, 5, 30) + sheet(14, 140, 3, 5, 30) + arrow(112, 64, 164, 112, -10) + arrow(112, 180, 164, 132, 10) +
        c(178, 122, 14, 'o y') + p('M172 122h12M178 116v12', 'o n') + arrow(194, 122, 214, 122, 0) +
        paper(222, 16, 124, 218) + t(236, 46, 'Informe', 'b') + lines(236, 64, 90, 2, 12) +
        [0, 1, 2].map(i => r(240 + i * 28, 140 - [30, 54, 40][i], 20, [30, 54, 40][i], i === 1 ? 'c' : 'cs', 2)).join('') + lines(236, 166, 90, 3, 13) +
        r(282, 204, 54, 22, 'y', 11) + t(309, 219, '5 min', 'xs b mid')
    },
    'Paso 5 · Tres cifras, a mano': {
      alt:'Una calculadora y tres etiquetas con las cifras principales del informe, cada una marcada como comprobada a mano.',
      svg:r(24, 30, 120, 196, 'o i', 14) + r(36, 44, 96, 40, 'p', 6) + t(124, 72, '8.240', 'lg b end') +
        [0, 1, 2, 3].map(i => [0, 1, 2].map(j => r(36 + j * 34, 96 + i * 32, 26, 24, i === 3 && j === 2 ? 'y' : 'cs', 5)).join('')).join('') +
        [['Facturado', '42.600 €'], ['Sin cobrar', '8.240 €'], ['Vencido', '3.150 €']].map(([k, v], i) =>
          r(170, 34 + i * 64, 176, 48, 'o p', 10) + t(184, 54 + i * 64, k, 'xs tm') + t(184, 72 + i * 64, v, 'b') + check(326, 58 + i * 64, 11)).join('')
    },
    'Lo que debería salir': {
      alt:'Lo que cuenta el informe: una barra con lo cobrado y lo pendiente, y la lista de clientes que pagan tarde con un sello de «Vencido».',
      svg:t(70, 30, 'Facturado', 'sm b mid') + r(40, 44, 60, 186, 'o h', 4) + r(40, 44, 60, 58, 'o c', 4) + t(70, 78, 'sin', 'xs tw b mid') + t(70, 92, 'cobrar', 'xs tw b mid') + t(70, 170, 'cobrado', 'xs tw b mid') +
        t(150, 30, 'Pagan tarde', 'sm b') + ['Talleres Ruiz', 'Hnos. Gil', 'Bar Central'].map((s, i) =>
          r(150, 44 + i * 44, 196, 34, 'o p', 8) + t(164, 66 + i * 44, s, 'sm') + c(322, 61 + i * 44, 9, 'o y') + p(`M322 ${55 + i * 44}v6l4 3`, 'o n')).join('') +
        g('rotate(-8 250 206)', r(184, 188, 132, 38, 'stamp', 6) + t(250, 214, 'VENCIDO', 'lg b mid tc'))
    }
  },
  16: {
    'Lo que necesitas': {
      alt:'Una nube que hace el trabajo mientras el portátil está cerrado y durmiendo, con las tres cosas necesarias: plan de pago, Gmail conectado y búsqueda web.',
      svg:p('M70 110a34 34 0 0 1 20-62a46 46 0 0 1 86-8a36 36 0 0 1 40 70z', 'o hs') + gear(140, 80, 24, 8) +
        p('M48 196h124l16 20H32z', 'o s') + p('M60 196l14-46h96l-14 46z', 'o p') + t(124, 154, 'z', 'b tm') + t(140, 138, 'z', 'lg b tm') + t(158, 120, 'Z', 'lg b tm') +
        [['Plan de pago', 'o y'], ['Gmail conectado', 'o p'], ['Búsqueda web', 'o p']].map(([s, cls], i) =>
          r(212, 44 + i * 52, 134, 38, cls, 10) + check(232, 63 + i * 52, 9) + t(248, 68 + i * 52, s, 'xs b')).join('')
    },
    'Lo que gasta': {
      alt:'La barra de uso semanal con un bloque por cada día que se ejecuta la tarea, y un selector para bajar de Sonnet a Haiku si sube demasiado.',
      svg:t(24, 36, 'Uso semanal', 'b') + r(24, 50, 312, 36, 'o p', 18) +
        [0, 1, 2, 3, 4].map(i => r(30 + i * 40, 56, 36, 24, i === 4 ? 'c' : 'cs', 12)).join('') +
        ['L', 'M', 'X', 'J', 'V'].map((d, i) => t(48 + i * 40, 104, d, 'xs mid tm')).join('') +
        r(24, 140, 150, 80, 'o s', 12) + t(40, 166, 'Modelo', 'xs tm') + t(40, 190, 'Sonnet', 'b') + arrow(180, 180, 214, 180, 0) +
        r(220, 140, 116, 80, 'o y', 12) + t(236, 166, 'gasta menos', 'xs') + t(236, 190, 'Haiku', 'b')
    },
    'La idea que se queda': {
      alt:'Una pantalla de configuración con la tarea programada de lunes a viernes a las 8:00, un despertador y un borrador que llega solo a tu correo.',
      svg:win(14, 18, 210, 214, 'Nueva tarea') + t(30, 66, 'Nombre', 'xs tm') + r(30, 72, 176, 24, 'o s', 6) + t(40, 89, 'Resumen de la mañana', 'xs') +
        t(30, 118, 'Cuándo', 'xs tm') + r(30, 124, 84, 24, 'o y', 6) + t(72, 141, 'L–V', 'xs b mid') + r(122, 124, 84, 24, 'o y', 6) + t(164, 141, '8:00', 'xs b mid') +
        t(30, 180, 'Activa', 'sm') + toggle(168, 166, true) +
        c(292, 70, 36, 'o p') + c(268, 38, 10, 'o c') + c(316, 38, 10, 'o c') + p('M292 70V48M292 70l14 8', 'o n thick') +
        arrow(236, 156, 268, 168, -8) + envelope(270, 150, 76, 52, 'o y') + t(308, 222, 'borrador listo', 'xs mid b')
    }
  },
  17: {
    'Por qué en cuatro fases': {
      alt:'Una escalera de cuatro peldaños: ensayo con datos falsos, afinado, prueba en real con supervisión y, arriba del todo con bandera, la automatización.',
      svg:p('M14 232h70v-46h70v-46h70v-46h70v-46h66', 'o n thick') + p('M14 232h70v-46h70v-46h70v-46h70v-46h52V232z', 'cs') +
        p('M14 232h70v-46h70v-46h70v-46h70v-46h52', 'o n thick') +
        t(48, 222, 'Ensayo', 'sm b mid') + t(118, 176, 'Afinado', 'sm b mid') + t(188, 130, 'En real', 'sm b mid') + t(259, 84, 'Automático', 'sm b mid') +
        p('M330 48V8', 'o n thick') + p('M330 8l26 10-26 10z', 'o c') + person(48, 154, 'y')
    },
    'Fase 3 · La pregunta de seguridad': {
      alt:'Un correo que pide «nuevo número de cuenta» colgado de un anzuelo, con una bandera roja: la estafa del cambio de datos bancarios.',
      svg:p('M170 0v62', 'o n') + p('M170 62v26q0 18 16 18t16-18v-6', 'o n thick') + p('M202 82l-6 8', 'o n thick') +
        r(70, 96, 220, 130, 'o p', 8) + p('M70 96l110 60 110-60', 'o n') + r(96, 160, 168, 50, 'o cs', 6) +
        t(108, 182, 'Nuevo número de cuenta:', 'xs b') + code(108, 200, 'ES00 0000 ····', 'xs') +
        p('M316 228V120', 'o n thick') + p('M316 120h36l-10 16 10 16h-36z', 'o c') + t(42, 54, '¡Ojo!', 'lg b tc hand')
    },
    'El límite que no se cruza': {
      alt:'El botón «Enviar» detrás de una cinta de no pasar; al lado, la bandeja de borradores llena. Claude prepara; quien aprieta el botón eres tú.',
      svg:r(24, 30, 150, 118, 'o s', 10) + t(40, 56, 'Borradores', 'sm b') + r(132, 42, 30, 20, 'c', 10) + t(147, 57, '3', 'xs tw b mid') +
        [0, 1, 2].map(i => r(40, 68 + i * 24, 118, 18, 'o p', 4)).join('') +
        r(206, 74, 132, 50, 'o c', 25) + t(272, 105, 'Enviar', 'b tw mid') +
        p('M196 64v104M348 64v104', 'o n thick') + g('rotate(-6 272 116)', r(190, 110, 164, 13, 'tape', 2)) +
        person(120, 190, 'y') + t(250, 200, 'el botón', 'tc hand mid') + t(250, 218, 'lo aprietas tú', 'tc hand mid')
    }
  },
  18: {
    'Por qué con IA y no con un folio en blanco': {
      alt:'Un iceberg: por encima del agua, lo que cuentas de tu trabajo; por debajo, mucho más grande, todo lo que haces en automático sin darte cuenta.',
      svg:r(0, 92, 360, 158, 'hs', 0) + p('M0 92h360', 'o n') + p('M130 92l34-60 22 22 20-12 26 50z', 'o p') +
        p('M90 92l-30 60 40 70h150l50-80-36-50z', 'o cs') + t(180, 20, 'lo que cuentas', 'sm b mid') +
        t(180, 132, 'miro que esté el', 'sm mid') + t(180, 148, 'número de pedido', 'sm mid') + t(180, 176, 'aviso a contabilidad', 'sm mid') + t(180, 204, 'reviso la fecha', 'sm mid') +
        t(330, 240, 'en automático', 'xs tm end')
    },
    'Paso 3 · Responde con calma': {
      alt:'Un árbol de decisión en lugar de un «depende»: ¿tiene NIF? Si sí, factura normal; si no, pides los datos antes de seguir.',
      svg:r(120, 18, 120, 40, 'o y', 10) + t(180, 43, '¿Tiene NIF?', 'sm b mid') +
        p('M150 58l-60 54M210 58l60 54', 'o n') + t(108, 86, 'sí', 'xs b tc') + t(244, 86, 'no', 'xs b tc') +
        r(20, 112, 140, 44, 'o p', 10) + t(90, 139, 'Factura normal', 'sm mid') + r(200, 112, 140, 44, 'o p', 10) + t(270, 139, 'Pido los datos', 'sm mid') +
        p('M270 156v20', 'o n') + r(200, 176, 140, 40, 'o cs', 10) + t(270, 201, '¿Es urgente?', 'sm mid') +
        t(90, 202, 'no digas «depende»:', 'xs tc hand mid') + t(90, 218, 'di de qué', 'xs tc hand mid')
    },
    'Paso 4 · El procedimiento': {
      alt:'El procedimiento escrito con sus pasos numerados y una linterna que ilumina un hueco: el paso que faltaba.',
      svg:paper(18, 16, 200, 220) + t(34, 46, 'Procedimiento', 'b') + t(34, 74, '1', 'sm b tc') + lines(52, 70, 140, 1) +
        t(34, 102, '2', 'sm b tc') + lines(52, 98, 140, 1) + r(30, 116, 172, 30, 'o y dashbox', 6) + t(116, 136, '?', 'lg b mid tc') +
        t(34, 172, '4', 'sm b tc') + lines(52, 168, 140, 1) + t(34, 200, '5', 'sm b tc') + lines(52, 196, 120, 1) +
        p('M210 130L330 80V180z', 'beam') + g('rotate(-22 320 130)', r(300, 116, 56, 26, 'o i', 6) + r(292, 112, 12, 34, 'o c', 3))
    },
    'Paso 7 · Compártelo (si tu plan lo permite)': {
      alt:'El asistente con el procedimiento en el centro y tres compañeros conectados que le preguntan a él en vez de a ti.',
      svg:p('M180 120L58 54M180 120L302 54M180 120L180 204', 'o n dash') +
        r(118, 88, 124, 64, 'o y', 12) + spark(140, 110, 10) + t(158, 115, 'Asistente', 'sm b') + t(140, 138, 'pedidos.md', 'xs mono') +
        person(58, 40, 'cs') + person(302, 40, 'hs') + person(180, 196, 'cs') +
        r(214, 176, 132, 34, 'o p', 14) + t(226, 198, '¿Cómo se hace…?', 'xs')
    }
  },
  19: {
    'La regla que va con el regalo': {
      alt:'Seis tareas programadas en fila: cinco apagadas y una elegida, levantada; debajo, cinco días seguidos leyéndola.',
      svg:[0, 1, 2, 3, 4, 5].map(i => i === 2
        ? r(20 + i * 56, 20, 46, 60, 'o y', 8) + check(43 + i * 56, 50, 12)
        : r(20 + i * 56, 54, 46, 60, 'o s faded', 8)).join('') +
        t(180, 146, 'una sola, cinco días', 'tc hand mid') +
        ['L', 'M', 'X', 'J', 'V'].map((d, i) => r(56 + i * 52, 166, 40, 48, 'o p', 8) + t(76 + i * 52, 184, d, 'xs b mid') + check(76 + i * 52, 200, 8)).join('')
    },
    'Cómo poner una en marcha (repaso del día 16)': {
      alt:'Una semana con la tarea repetida cada mañana, el botón «Ejecutar ahora» para probarla y una marca para revisarla la semana siguiente.',
      svg:r(14, 18, 332, 128, 'o p', 10) + ['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d, i) => t(38 + i * 46, 38, d, 'xs b mid') + (i < 7 ? p(`M${61 + i * 46} 46v100`, 'grid') : '')).join('') +
        p('M14 46h332', 'o n') + [0, 1, 2, 3, 4].map(i => r(20 + i * 46, 58, 36, 22, 'y', 5) + t(38 + i * 46, 73, '8:00', 'xxs b mid')).join('') +
        r(24, 170, 160, 40, 'c', 10) + p('M44 180l14 10-14 10z', 'p') + t(68, 195, 'Ejecutar ahora', 'sm tw b') + p('M150 192l0 30 8-7 6 13 6-3-6-13 11-1z', 'o p') +
        cal(246, 162, 64, 72, '+7', 'REVISA')
    },
    'Y si estás en el gratuito': {
      alt:'Un botón grande con la palabra clave MAÑANA y una mano a punto de pulsarlo: no es automático, pero es un clic.',
      svg:p('M80 190h200v24H80z', 'o i') + p('M100 190a80 30 0 0 1 160 0', 'o cs') + p('M110 182a70 22 0 0 1 140 0v-24a70 22 0 0 0-140 0z', 'o c') +
        p('M110 158a70 22 0 0 1 140 0a70 22 0 0 1-140 0z', 'o c') + t(180, 164, 'MAÑANA', 'b tw mid') +
        p('M196 40v58l-10-12q-10-6-14 4l18 30h52l6-40q0-10-10-10h-10v-8q0-10-10-10h-6v-6q0-10-10-10z', 'o cs') +
        p('M178 56l-14-12M176 80h-18M214 56l12-14', 'o n') + t(180, 240, 'no es automático, pero es un clic', 'sm tc hand mid')
    },
    'La regla final': {
      alt:'Un montón de correos sin abrir cubierto de telarañas, camino de la papelera: si no lo lees, es ruido.',
      svg:g('rotate(-6 100 190)', envelope(30, 176, 130, 54, 'o s')) + g('rotate(4 100 150)', envelope(40, 128, 130, 54, 'o p')) + g('rotate(-3 100 110)', envelope(32, 84, 130, 54, 'o s')) +
        p('M32 84l40 30M32 84l20 40M32 84l46 6M40 98q12 4 22-4M44 110q18 0 26-14', 'o n web') +
        arrow(180, 130, 236, 140, -16) + p('M250 118h86l-10 112h-66z', 'o p') + r(244, 104, 98, 14, 'o cs', 4) +
        p('M276 136v80M294 136v80M312 136v80', 'grid') + t(180, 38, 'sin leer = ruido', 'lg tc hand mid')
    }
  },
  20: {
    'Antes de nada: lo que necesitas': {
      alt:'Un ordenador con Chrome abierto, marcado como válido; un móvil y otros navegadores, tachados.',
      svg:r(40, 40, 170, 116, 'o p', 8) + r(52, 52, 146, 92, 's', 4) + c(125, 98, 26, 'o y') + c(125, 98, 10, 'o p') + p('M24 156h202l-12 18H36z', 'o i') + check(214, 44, 14) +
        r(262, 38, 62, 108, 'o i', 10) + r(268, 50, 50, 82, 'p', 3) + cross(320, 40, 12) +
        c(260, 196, 18, 'o cs') + c(310, 196, 18, 'o cs') + p('M246 182l28 28M296 182l28 28', 'o n thick tcstroke') + t(285, 238, 'otros navegadores', 'xs mid tm') +
        pill(52, 196, 140, 'plan de pago', 'o y')
    },
    'Paso 2 · Añádela': {
      alt:'El cuadro de permisos de la extensión: ver las páginas, hacer clic, escribir y hacer capturas, con los botones Cancelar y Añadir.',
      svg:r(30, 14, 300, 222, 'o p', 14) + t(50, 44, '¿Añadir la extensión?', 'b') + t(50, 66, 'Podrá:', 'sm tm') +
        ['Ver las páginas que visitas', 'Hacer clic por ti', 'Escribir en formularios', 'Hacer capturas'].map((s, i) =>
          c(60, 88 + i * 28, 8, i % 2 ? 'o cs' : 'o y') + t(78, 93 + i * 28, s, 'sm')).join('') +
        r(150, 196, 80, 30, 'o s', 8) + t(190, 216, 'Cancelar', 'sm mid') + r(240, 196, 76, 30, 'c', 8) + t(278, 216, 'Añadir', 'sm tw b mid')
    },
    'La idea que se queda': {
      alt:'A la izquierda, un ojo que solo lee (un conector); a la derecha, un cursor que hace clic y escribe (actúa); y una señal de ceda el paso: al principio, despacio.',
      svg:p('M20 90q60-60 120 0q-60 60-120 0z', 'o p') + c(80, 90, 20, 'o c') + c(80, 90, 8, 'i') + t(80, 150, 'Un conector lee', 'sm b mid') +
        p('M222 56l0 64 16-14 12 26 12-6-12-26 22-2z', 'o y') + p('M210 46l-10-10M238 40v-14M262 50l10-10', 'o n') + t(250, 150, 'Esto actúa', 'sm b mid') +
        p('M180 236l-34-58h68z', 'o p') + p('M180 226l-24-42h48z', 'o n tcstroke thick') + t(270, 222, 'despacio', 'tc hand')
    }
  },
  21: {
    'Paso 2 · Pide un artefacto interactivo': {
      alt:'La ventana de Claude dividida en dos: a la izquierda el chat con tu petición, a la derecha se abre el artefacto con la lista de la compra interactiva.',
      svg:win(10, 18, 340, 214) + r(24, 54, 120, 50, 'o y', 12) + t(36, 76, 'Crea mi lista', 'xs b') + t(36, 92, 'interactiva', 'xs') +
        spark(32, 124, 9) + lines(46, 124, 90, 3, 12) + p('M156 40v192', 'o n') +
        r(170, 52, 166, 166, 'o s', 8) + t(184, 76, 'Lista de la compra', 'sm b') +
        ['Leche', 'Pan', 'Huevos', 'Tomates'].map((s, i) => r(184, 92 + i * 28, 16, 16, i === 0 ? 'o h' : 'o p', 4) + t(210, 105 + i * 28, s, 'sm')).join('') +
        p('M187 100l4 4 7-7', 'w3') + arrow(140, 172, 166, 172, 0)
    },
    'Paso 3 · Pruébala como si estuvieras en la tienda': {
      alt:'El móvil con la lista en la tienda: la leche marcada y tachada, los plátanos recién añadidos, la cantidad de pan cambiada y los tomates a punto de borrarse; al lado, un carro.',
      svg:r(24, 10, 168, 232, 'o i', 18) + r(32, 30, 152, 196, 'p', 6) + t(44, 52, 'Pendiente', 'xs tm b') +
        r(42, 62, 16, 16, 'o h', 4) + p('M45 70l4 4 7-7', 'w3') + t(66, 75, 'Leche', 'sm tm') + p('M64 71h44', 'o n') +
        r(38, 88, 142, 26, 'y', 6) + r(42, 93, 16, 16, 'o p', 4) + t(66, 106, 'Plátanos', 'sm b') + t(146, 106, 'nuevo', 'xxs tc b') +
        r(42, 124, 16, 16, 'o p', 4) + t(66, 137, 'Pan', 'sm') + c(130, 132, 9, 'o s') + t(130, 136, '−', 'xs b mid') + t(146, 137, '2', 'sm b mid') + c(162, 132, 9, 'o s') + t(162, 136, '+', 'xs b mid') +
        r(42, 156, 16, 16, 'o p', 4) + t(66, 169, 'Tomates', 'sm') + p('M150 158h18M153 158v14h12v-14M156 154h6', 'o n') +
        r(42, 192, 132, 24, 'o s', 12) + t(108, 208, '↶ Deshacer', 'xs mid') +
        p('M226 120h20l18 70h66l14-50H254', 'o n thick') + c(274, 208, 9, 'o p') + c(318, 208, 9, 'o p') + r(264, 118, 30, 22, 'o y', 3) + r(298, 112, 26, 28, 'o cs', 3)
    },
    'La idea que se queda': {
      alt:'Una caja de herramientas abierta con una herramienta pequeña hecha a tu medida, y unas flechas en círculo: para las tareas que se repiten.',
      svg:p('M60 120h240v100H60z', 'o c') + p('M60 120l20-30h200l20 30', 'o cs') + r(150, 100, 60, 14, 'o n thick', 7) + r(160, 150, 40, 16, 'y', 3) +
        g('rotate(-10 180 70)', r(130, 30, 100, 70, 'o p', 8) + r(142, 44, 12, 12, 'o h', 3) + lines(162, 50, 54, 1) + r(142, 66, 12, 12, 'o p', 3) + lines(162, 72, 44, 1)) +
        p('M300 50a34 34 0 1 1-30-20', 'arw thick') + p('M262 22l10 8-10 10', 'arw thick') + t(318, 18, 'se repite', 'sm tc hand mid')
    }
  },
  22: {
    'Paso 1 · Descarga el brief': {
      alt:'Una carpeta con pinza con el brief del cartel: público, objetivo, texto exacto y una lista corta de comprobación; al lado, una pila de libros.',
      svg:r(40, 22, 170, 214, 'o y', 10) + r(54, 40, 142, 186, 'o p', 4) + r(96, 14, 58, 22, 'o i', 6) +
        t(66, 66, 'Brief · Cartel', 'sm b') + t(66, 92, 'Público:', 'xs b') + t(116, 92, 'el barrio', 'xs') + t(66, 112, 'Objetivo:', 'xs b') + t(122, 112, 'intercambio', 'xs') +
        t(66, 132, 'Texto exacto:', 'xs b') + lines(66, 146, 110, 1) +
        [0, 1, 2].map(i => r(66, 164 + i * 18, 11, 11, 'o p', 2) + lines(84, 170 + i * 18, 80, 1)).join('') +
        r(240, 190, 100, 24, 'o c', 3) + r(248, 166, 88, 24, 'o y', 3) + r(244, 142, 94, 24, 'o hs', 3) + r(254, 118, 78, 24, 'o cs', 3)
    },
    'Paso 2 · Crea la primera versión': {
      alt:'Un cartel vertical de una página para el intercambio de libros, con el título, tres pasos y la fecha y el lugar; al lado, el móvil para compartirlo.',
      svg:r(70, 10, 160, 230, 'o y', 6) + t(150, 46, 'Intercambio', 'lg b mid tc') + t(150, 66, 'de libros', 'lg b mid tc') +
        r(112, 84, 18, 50, 'o c', 2) + r(132, 92, 16, 42, 'o hs', 2) + g('rotate(12 166 110)', r(152, 88, 16, 46, 'o p', 2)) +
        ['Elige tus libros', 'Tráelos', 'Llévate otros'].map((s, i) => c(96, 156 + i * 20, 7, 'c') + t(96, 160 + i * 20, String(i + 1), 'xxs tw b mid') + t(110, 160 + i * 20, s, 'xs')).join('') +
        r(70, 212, 160, 28, 'c', 0) + t(150, 231, 'Sábado · Biblioteca', 'xs tw b mid') +
        r(262, 120, 64, 112, 'o i', 10) + r(268, 132, 52, 86, 'y', 3) + lines(276, 150, 36, 3, 12, 'ln dark') + arrow(244, 110, 270, 126, -10)
    },
    'La idea que se queda': {
      alt:'La primera versión del cartel con dos chinchetas de comentario (título más grande, añadir la fecha) y una flecha hacia la segunda versión, ya revisada.',
      svg:r(18, 30, 120, 170, 'o p', 6) + t(78, 64, 'Intercambio', 'xs b mid') + lines(36, 90, 84, 4, 14) +
        c(130, 56, 12, 'o c') + t(130, 61, '1', 'xs tw b mid') + c(26, 190, 12, 'o c') + t(26, 195, '2', 'xs tw b mid') +
        t(78, 222, 'v1', 'b mid tm') + arrow(150, 114, 204, 114, -18) + spark(178, 80, 9) +
        r(218, 22, 128, 186, 'o y', 6) + t(282, 60, 'Intercambio', 'lg b mid tc') + t(282, 80, 'de libros', 'b mid tc') + lines(236, 108, 92, 3, 14) +
        r(218, 172, 128, 36, 'c', 0) + t(282, 195, 'Sábado 12', 'sm tw b mid') + t(282, 236, 'v2', 'b mid') + check(340, 28, 13)
    }
  },
  23: {
    '4 · Proyectos': {
      alt:'Una caja de archivo donde entran las carpetas de prueba A y B, mientras los proyectos que usas siguen en la estantería.',
      svg:p('M14 100h150', 'o n thick') + p('M24 100V40h30l6 8h26v52M96 100V48h30l6 8h26v44', 'o y') + t(56, 86, 'Trabajo', 'xs b mid') + t(128, 86, 'Casa', 'xs b mid') +
        p('M190 140h150v96H190z', 'o cs') + p('M182 122h166v20H182z', 'o c') + t(265, 196, 'Archivo', 'b mid') +
        g('rotate(-18 230 90)', p('M206 70h30l6 8h28v40h-64z', 'o p') + t(236, 106, 'Prueba A', 'xs b mid')) +
        g('rotate(14 300 80)', p('M280 54h30l6 8h28v40h-64z', 'o p') + t(310, 90, 'Prueba B', 'xs b mid')) + arrow(236, 132, 246, 156, 0) + arrow(300, 120, 292, 154, 0)
    },
    '5 · Uso': {
      alt:'La página de uso con la barra semanal casi llena por culpa de las tareas programadas, unas tijeras que recortan un día y la etiqueta Haiku para gastar menos.',
      svg:t(24, 40, 'Ajustes › Uso', 'sm tm') + t(24, 70, 'Esta semana', 'b') + r(24, 84, 312, 36, 'o p', 18) +
        p('M42 84h200v36H42a18 18 0 0 1 0-36z', 'cs') + [0, 1, 2, 3, 4].map(i => r(150 + i * 26, 90, 22, 24, i === 4 ? 'c' : 'y', 6)).join('') + r(24, 84, 312, 36, 'o n', 18) +
        t(214, 144, 'tareas programadas', 'xs tm mid') +
        c(256, 176, 11, 'o p') + c(256, 210, 11, 'o p') + p('M265 182l62-34M265 204l62 34', 'o n thick') + p('M300 150v90', 'o n dash') +
        pill(40, 176, 120, 'pasa a Haiku', 'o y') + t(100, 230, 'o quita días', 'sm tc hand mid')
    },
    'La frase del día': {
      alt:'Claude deja una bandeja con el trabajo preparado y una mano con un sello toma la decisión final.',
      svg:spark(40, 54, 16) + p('M24 170h220l-16 30H40z', 'o s') + g('rotate(-4 120 150)', r(60, 110, 110, 64, 'o p', 4) + lines(74, 130, 80, 3, 12)) +
        g('rotate(5 170 140)', r(124, 100, 100, 70, 'o p', 4) + lines(138, 120, 70, 3, 12)) + t(130, 226, 'trabajo preparado', 'sm mid tm') +
        g('rotate(-10 300 90)', r(278, 50, 44, 40, 'o i', 6) + r(270, 88, 60, 14, 'o c', 3)) + t(300, 140, 'decides tú', 'b tc mid hand')
    }
  },
  24: {
    'Cerrar el círculo': {
      alt:'Una taza de café humeante junto al cuaderno con los 24 días tachados, bajo una guirnalda de luces de Navidad.',
      svg:p('M0 24q90 40 180 10t180 10', 'o n') + [30, 84, 140, 200, 260, 320].map((x, i) => c(x, [36, 44, 42, 34, 38, 46][i], 7, ['y', 'c', 'h', 'y', 'c', 'h'][i])).join('') +
        r(20, 110, 100, 100, 'o c', 10) + p('M120 130q30 0 30 30t-30 30', 'o n thick') + p('M48 96q-8-12 0-24M70 96q-8-12 0-24M92 96q-8-12 0-24', 'o n') + p('M10 214h120', 'o n thick') +
        r(170, 90, 176, 130, 'o p', 6) + p('M258 90v130', 'o n') +
        Array.from({ length:24 }, (_, i) => { const x = i < 12 ? 180 + (i % 4) * 18 : 268 + (i % 4) * 18, y = 106 + Math.floor((i % 12) / 4) * 34; return r(x, y, 14, 14, 'o s', 3) + p(`M${x + 2} ${y + 2}l10 10M${x + 12} ${y + 2}l-10 10`, 'o n tcstroke'); }).join('')
    },
    'Pasos': {
      alt:'Tu mapa de 2027 con un camino punteado y tres chinchetas para enero, y una hoja de calendario del 1 de marzo con una campana de recordatorio.',
      svg:p('M14 30l70-14 70 14 70-14v190l-70 14-70-14-70 14z', 'o s') + p('M84 16v190M154 30v190', 'o n faint') + t(30, 58, 'Mi 2027', 'b') +
        p('M34 196q40-30 70-70t70-40', 'arw dash2') +
        [[54, 170, '1'], [108, 120, '2'], [174, 86, '3']].map(([x, y, s]) => p(`M${x} ${y}c-14-16-14-30 0-30s14 14 0 30z`, 'o c') + t(x as number, (y as number) - 18, s as string, 'xs tw b mid')).join('') +
        cal(256, 80, 86, 100, '1', 'MARZO') + p('M318 64q-2-16 14-16t14 16v12h-28z', 'o y') + c(332, 80, 3, 'i') + t(300, 206, 'recordatorio', 'xs mid tm')
    },
    'Y después': {
      alt:'Un poste con dos indicaciones: «Curso en enero» y «Aquí está bien». A sus pies, una mochila con 24 estrellas: lo que te llevas.',
      svg:p('M150 236V30', 'o n thick') + p('M150 50h120l20 18-20 18H150z', 'o y') + t(160, 74, 'Curso en enero', 'sm b') +
        p('M150 100H40l-20 18 20 18h110z', 'o p') + t(48, 124, 'Aquí está bien', 'sm b') +
        p('M240 236v-60a30 30 0 0 1 60 0v60z', 'o c') + p('M250 196h40v30h-40z', 'o cs') + t(270, 218, '24', 'sm b mid') +
        star5(258, 158, 6, 'y') + star5(284, 150, 8, 'y') + star5(306, 166, 5, 'y') + p('M0 236h360', 'o n thick')
    }
  }
};

/* ---------- piezas que solo usan algunos dibujos ---------- */
function star5(x:number, y:number, rad:number, cls = 'y') {
  const pts = Array.from({ length:10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? rad * .45 : rad; return `${n(x + rr * Math.cos(a))} ${n(y + rr * Math.sin(a))}`; });
  return p(`M${pts.join('L')}z`, cls.includes('o') ? cls : `o ${cls}`);
}
function flask(x:number, liquid:string) {
  return p(`M${x - 14} 60v50l-48 84q-5 12 8 12h108q13 0 8-12l-48-84V60z`, 'o p') +
    p(`M${x - 46} 166h92l17 30q4 10-8 10H${x - 55}q-12 0-8-10z`, liquid) + p(`M${x - 22} 60h44`, 'o n thick');
}
function padlock(x:number, y:number) {
  return p(`M${x - 9} ${y - 2}v-8a9 9 0 0 1 18 0v8`, 'o n thick') + r(x - 13, y - 2, 26, 20, 'o y', 4);
}

export function drawingFor(day:number, title:string):Drawing|null {
  const entry = drawings[day]?.[title.trim()];
  return entry ? { alt:entry.alt, svg:svg(entry.svg) } : null;
}

export function drawingTitles(day:number):string[] {
  return Object.keys(drawings[day] || {});
}
