import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { dayIcon, iconHref } from '../data/adviento-icons';
import { SNOW_DAYS } from '../data/adviento-tones';
import { createCaganerModel, createSmokePuff } from './adviento-caganer';

/*
 * Procedural Three.js advent house. The 24 drawers stay as real <button>s
 * (keyboard, screen readers, click), positioned every frame over the projected
 * 3D drawer fronts. If WebGL is unavailable the CSS house remains as fallback.
 */

type DayInfo = { dia:number; titulo:string; abre_el?:string; tipo?:string };
type DoorState = 'future'|'available'|'opened'|'completed';
type Track = <T extends { dispose():void }>(item:T) => T;
type FrontStyle = { bg:string; ink:string; tile:string; tileBorder:string; ribbon?:boolean; bow?:boolean; snow?:boolean; cane?:boolean; drift?:boolean };
type Layout = ReturnType<typeof layoutFor>;
type Drawer = {
  day:DayInfo; x:number; y:number; state:DoorState;
  group:THREE.Group; materials:THREE.Material[]; rim:THREE.MeshStandardMaterial;
  interior:THREE.Mesh; interiorMat:THREE.MeshStandardMaterial; interiorDrawn:string;
  index:number; box:THREE.MeshStandardMaterial; face:THREE.CanvasTexture; frontDrawn:string;
  pull:number; openStart:number; button:HTMLButtonElement|null;
};

/* Sculpt spec: colours are the DESIGN.md tokens (warm white facade with cherry roof and piping,
   yellow only for «Ábrelo»); lacquered, low-gloss finishes. 1 world unit = one drawer width. */
const SPEC = {
  color: {
    facade:'#f8f5ed', side:'#e4dacb', liner:'#d9cdbb', roof:'#691b32', roofUnder:'#521326',
    /* on the light facade: cherry text and piping, a dusty pink for the little stars */
    onFacade:'#691b32', facadeAccent:'#c68f9f',
    icing:'#f8f5ed', gold:'#f3c969', holly:'#2f6b47', hollySoft:'#e9f1e6', rimMuted:'#7d3048', rimOpen:'#e9d4d9', tray:'#e9d4d9',
    cherrySoft:'#e9d4d9', pine:'#5f755d', pineDark:'#4f6550', trunk:'#b98f63', snow:'#fffdf8', chimney:'#691b32', shadow:'#3b252d'
  },
  fronts: {
    cream:{ bg:'#f8f5ed', ink:'#691b32', tile:'rgba(105,27,50,.055)', tileBorder:'rgba(105,27,50,.16)' },
    pink:{ bg:'#e9d4d9', ink:'#691b32', tile:'rgba(105,27,50,.06)', tileBorder:'rgba(105,27,50,.16)' },
    wine:{ bg:'#691b32', ink:'#fff9ec', tile:'rgba(255,249,236,.12)', tileBorder:'rgba(255,249,236,.28)' },
    /* surprise days: the fir green of the trees beside the house */
    pine:{ bg:'#5f755d', ink:'#fff9ec', tile:'rgba(255,249,236,.14)', tileBorder:'rgba(255,249,236,.3)' },
    /* Christmas Eve: the big present, deep pine wrapped in a gold ribbon with a bow */
    eve:{ bg:'#34503f', ink:'#fff9ec', tile:'rgba(255,249,236,.14)', tileBorder:'rgba(243,201,105,.45)', ribbon:true, bow:true },
    /* day 15, halfway: Christmas-jumper red with snowflakes, a milestone worth reaching */
    halfway:{ bg:'#b3293f', ink:'#fff9ec', tile:'rgba(255,249,236,.16)', tileBorder:'rgba(255,249,236,.38)', snow:true },
    /* day 1, the start: a candy cane, red and white stripes with a cream tag for the number */
    cane:{ bg:'#fff9ec', ink:'#691b32', tile:'rgba(105,27,50,.07)', tileBorder:'rgba(105,27,50,.2)', cane:true },
    /* a few loose days dressed as snow: cold white, a drift piled on the top edge, ice-blue glints */
    snow:{ bg:'#d9e7f2', ink:'#691b32', tile:'rgba(255,255,255,.6)', tileBorder:'rgba(70,104,138,.3)', drift:true }
  } satisfies Record<string,FrontStyle>,
  camera: { fov:30, yaw:-.34, pitch:.13, yawRange:[-.62, .3], pitchRange:[.04, .21], dragSpeed:.0055 },
  openMs: 900,
  /* where the opened card rests, and where it waits while the tray slides out past it */
  cardZ: { rest:-.1, behindTray:-.55 }
};

/*
 * Fronts run in diagonal ribbons (warm white, cherry soft, cherry), like wrapping paper, so the
 * rhythm reads as intended at 6 and at 4 columns. Every drawer keeps its colour; yellow is not
 * decoration (DESIGN.md), so «Ábrelo» and the rim of a drawer you can open now are the only yellow. The CSS fallback uses the same
 * ribbons through the tone-* classes set in adviento.astro.
 */
const ribbons = [SPEC.fronts.cream, SPEC.fronts.pink, SPEC.fronts.wine];
/* which day gets which landmark look: src/data/adviento-tones.ts (shared with the CSS fallback) */
function frontStyle(index:number, cols:number, state:DoorState, day:DayInfo):FrontStyle {
  /* landmark days (1, 15, 24 and the snowy ones) keep their look when they can be opened */
  if (day.dia === 24) return SPEC.fronts.eve;
  if (day.dia === 15) return SPEC.fronts.halfway;
  if (day.dia === 1) return SPEC.fronts.cane;
  if (SNOW_DAYS.includes(day.dia)) return SPEC.fronts.snow;
  if (day.tipo === 'Sorpresa') return SPEC.fronts.pine;
  const r = Math.floor(index / cols), c = index % cols;
  const base = ribbons[((c - r) % 3 + 3) % 3];
  /* gift days wear a gold ribbon over their usual colour */
  return day.tipo === 'Regalo' ? { ...base, ribbon:true } : base;
}

const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
function shortDate(iso?:string) {
  const m = iso?.match(/^\d{4}-(\d{2})-(\d{2})/);
  return m ? `${Number(m[2])} ${months[Number(m[1]) - 1]}` : '';
}

function drawRosetteStar(ctx:CanvasRenderingContext2D, cx:number, cy:number, radius:number, color:string) {
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i < 16; i++) {
    const angle = -Math.PI / 2 + i * Math.PI / 8;
    const r = i % 2 ? radius * .38 : radius;
    const x = cx + Math.cos(angle) * r, y = cy + Math.sin(angle) * r;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.closePath(); ctx.fillStyle = color; ctx.fill(); ctx.restore();
}

function layoutFor(compact:boolean) {
  const cols = compact ? 4 : 6, rows = 24 / cols;
  const cellW = 1, cellH = compact ? .96 : .8, gap = compact ? .1 : .13, padX = compact ? .24 : .34;
  const plinthH = compact ? .5 : .5, eaveH = compact ? .4 : .44;
  const gridW = cols * cellW + (cols - 1) * gap, gridH = rows * cellH + (rows - 1) * gap;
  const bodyW = gridW + 2 * padX;
  const gridTop = plinthH + gridH;
  const bodyH = gridTop + .14 + eaveH;
  const gable = bodyW * (compact ? .34 : .25);
  const depth = compact ? 1.9 : 2.3;
  const sideMargin = compact ? .5 : 1.55;
  const frame = { left:-bodyW / 2 - sideMargin - (compact ? .3 : .25), right:bodyW / 2 + sideMargin + (compact ? .2 : -.15), bottom:compact ? -.5 : -.85, top:bodyH + gable + (compact ? .5 : .45) };
  /* openings must never touch, or the facade triangulation collapses */
  const holePad = gap - .04, rimPad = gap - holePad - .004;
  return { compact, cols, rows, cellW, cellH, gap, padX, plinthH, eaveH, gridW, gridH, bodyW, gridTop, bodyH, gable, depth, frame, holePad, rimPad };
}

function cellCenter(L:Layout, index:number) {
  const c = index % L.cols, r = Math.floor(index / L.cols);
  return { x:-L.gridW / 2 + L.cellW / 2 + c * (L.cellW + L.gap), y:L.gridTop - L.cellH / 2 - r * (L.cellH + L.gap) };
}

/* Deterministic noise for procedural textures. */
function rng(seed:number) { return () => { seed |= 0; seed = seed + 0x6d2b79f5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

function roundRect(ctx:CanvasRenderingContext2D, x:number, y:number, w:number, h:number, r:number) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

function roundedRectShape(cx:number, cy:number, w:number, h:number, r:number, path:THREE.Path = new THREE.Shape()) {
  const x = cx - w / 2, y = cy - h / 2;
  path.moveTo(x + r, y); path.lineTo(x + w - r, y); path.quadraticCurveTo(x + w, y, x + w, y + r);
  path.lineTo(x + w, y + h - r); path.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  path.lineTo(x + r, y + h); path.quadraticCurveTo(x, y + h, x, y + h - r);
  path.lineTo(x, y + r); path.quadraticCurveTo(x, y, x + r, y);
  return path;
}

const FONT = '"Inter Tight", Arial, system-ui, sans-serif';

function spacedText(ctx:CanvasRenderingContext2D, text:string, cx:number, y:number, spacing:number) {
  const chars = [...text]; const widths = chars.map(ch => ctx.measureText(ch).width);
  let x = cx - (widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1)) / 2;
  ctx.textAlign = 'left';
  chars.forEach((ch, i) => { ctx.fillText(ch, x, y); x += widths[i] + spacing; });
}

function wrapLines(ctx:CanvasRenderingContext2D, text:string, maxWidth:number, maxLines:number) {
  const words = text.split(/\s+/); const lines:string[] = []; let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) { lines.push(line); line = word; } else line = next;
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) { lines.length = maxLines; lines[maxLines - 1] += '…'; }
  return lines;
}

/* Icons come from the same SVG sprite the DOM uses, rasterised per colour. */
class IconAtlas {
  private symbols = new Map<string,Element>();
  private cache = new Map<string,Promise<HTMLImageElement|null>>();
  async load() {
    const url = iconHref('gift').split('#')[0];
    const text = await fetch(url).then(res => res.text());
    const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
    doc.querySelectorAll('symbol').forEach(symbol => this.symbols.set(symbol.id, symbol));
  }
  get(name:string, color:string) {
    const key = `${name}|${color}`;
    if (!this.cache.has(key)) this.cache.set(key, this.render(name, color));
    return this.cache.get(key)!;
  }
  private async render(name:string, color:string) {
    const symbol = this.symbols.get(name); if (!symbol) return null;
    const inner = new XMLSerializer().serializeToString(symbol).replace(/^<symbol[^>]*>|<\/symbol>$/g, '');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${symbol.getAttribute('viewBox') || '0 0 24 24'}" width="256" height="256" fill="none" stroke="${color}" color="${color}" stroke-width="${symbol.getAttribute('stroke-width') || '1.8'}" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
    const img = new Image(); img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    try { await img.decode(); return img; } catch { return null; }
  }
}

export async function mountHouse3D(scene:HTMLElement, grid:HTMLElement, days:DayInfo[]) {
  const probe = document.createElement('canvas');
  if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) return null;

  const icons = new IconAtlas();
  await Promise.all([
    icons.load(),
    document.fonts?.load(`600 40px ${FONT}`), document.fonts?.load(`400 40px ${FONT}`)
  ].map(p => Promise.resolve(p).catch(() => null)));

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const compactQuery = matchMedia('(max-width: 900px)');

  const canvas = document.createElement('canvas');
  canvas.className = 'house-canvas'; canvas.setAttribute('aria-hidden', 'true');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true, powerPreference:'high-performance' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.02;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.setClearColor(0x000000, 0);
  const maxAniso = renderer.capabilities.getMaxAnisotropy();

  const world = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  world.environment = pmrem.fromScene(new RoomEnvironment(), .04).texture;
  world.environmentIntensity = .38;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(SPEC.camera.fov, 1, .1, 100);
  const hemi = new THREE.HemisphereLight('#ffffff', '#f8f5ed', 1.35); world.add(hemi);
  const key = new THREE.DirectionalLight('#ffffff', 2.1); key.castShadow = true;
  key.shadow.bias = -.0004; key.shadow.normalBias = .025; world.add(key, key.target);
  const rim = new THREE.DirectionalLight('#fff3e6', .5); world.add(rim);

  let L = layoutFor(compactQuery.matches);
  let house = new THREE.Group();
  let drawers:Drawer[] = [];
  let bulbs:THREE.InstancedMesh[] = [];
  let ppu = 256;
  let sceneWidth = 0;
  const disposables = new Set<{ dispose():void }>();
  let caganer:THREE.Group|null = null;
  let caganerGone = scene.dataset.caganerFound === 'true';
  let poof:{ start:number; scale:number; group:THREE.Group; update(elapsed:number):boolean; told:boolean }|null = null;
  const track = <T extends { dispose():void }>(item:T) => { disposables.add(item); return item; };

  function canvasTexture(w:number, h:number, draw:(ctx:CanvasRenderingContext2D, w:number, h:number) => void, repeat = false) {
    const c = document.createElement('canvas'); c.width = Math.max(2, Math.round(w)); c.height = Math.max(2, Math.round(h));
    draw(c.getContext('2d')!, c.width, c.height);
    const tex = track(new THREE.CanvasTexture(c));
    tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = maxAniso;
    if (repeat) tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }
  const mat = (params:THREE.MeshStandardMaterialParameters) => track(new THREE.MeshStandardMaterial(params));
  const geo = <T extends THREE.BufferGeometry>(g:T) => track(g);
  const shadowed = <T extends THREE.Object3D>(obj:T, cast = true, receive = true) => { obj.castShadow = cast; obj.receiveShadow = receive; return obj; };

  /* ---------- textures ---------- */
  function grainTexture() {
    const rand = rng(24);
    const tex = canvasTexture(512, 512, (ctx, w, h) => {
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 260; i++) {
        const x = rand() * w, a = .012 + rand() * .02;
        ctx.strokeStyle = `rgba(70,20,40,${a})`; ctx.lineWidth = .6 + rand() * 1.8;
        ctx.beginPath(); ctx.moveTo(x, 0);
        for (let y = 0; y <= h; y += 32) ctx.lineTo(x + Math.sin(y * .02 + i) * 2.5, y);
        ctx.stroke();
      }
    }, true);
    tex.repeat.set(.45, .45);
    return tex;
  }
  function plankTexture() {
    const tex = canvasTexture(256, 32, (ctx, w, h) => {
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h);
      /* faint seams: on the light walls of the drawer holes strong lines shimmer as the house turns */
      ctx.fillStyle = 'rgba(59,37,45,.07)'; ctx.fillRect(0, 0, 3, h);
    }, true);
    tex.repeat.set(1 / .55, 1);
    return tex;
  }
  function shingleTexture(length:number, depth:number) {
    const tex = canvasTexture(256, 256, (ctx, w, h) => {
      ctx.fillStyle = SPEC.color.roof; ctx.fillRect(0, 0, w, h);
      const rows = 4, cols = 4, rh = h / rows, cw = w / cols;
      for (let r = 0; r < rows; r++) for (let c = -1; c <= cols; c++) {
        const x = c * cw + (r % 2 ? cw / 2 : 0), y = r * rh;
        const g = ctx.createLinearGradient(0, y, 0, y + rh);
        g.addColorStop(0, '#5a1630'); g.addColorStop(1, '#7a2440');
        ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + cw, y); ctx.lineTo(x + cw, y + rh * .55);
        ctx.quadraticCurveTo(x + cw / 2, y + rh * 1.25, x, y + rh * .55); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = 'rgba(248,245,237,.12)'; ctx.lineWidth = 2; ctx.stroke();
      }
    }, true);
    tex.repeat.set(length / 1.1, depth / 1.1);
    return tex;
  }

  /*
   * A closed drawer front: a lacquered panel with a fine inset (shaker cabinet), the day number
   * and its icon on one baseline, and the brass pull as real geometry above. The state is said
   * with shape and words, not colour alone (DESIGN.md · Estados): a padlock and the date while it
   * is still closed, «Ábrelo» when it can be opened.
   */
  function drawFront(ctx:CanvasRenderingContext2D, w:number, h:number, d:Drawer, style:FrontStyle, icon:HTMLImageElement|null) {
    const u = Math.min(w, h);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = style.bg; ctx.fillRect(0, 0, w, h);
    /* lacquer: a little light at the top, a little weight at the bottom */
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, 'rgba(255,255,255,.16)'); g.addColorStop(.5, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(60,10,30,.08)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    /* inset panel: a light edge over a dark one reads as a shallow groove */
    const inset = u * .075, panelR = u * .05;
    roundRect(ctx, inset + 1, inset + 1, w - inset * 2, h - inset * 2, panelR);
    ctx.lineWidth = Math.max(1, u * .007); ctx.strokeStyle = 'rgba(255,255,255,.28)'; ctx.stroke();
    roundRect(ctx, inset, inset, w - inset * 2, h - inset * 2, panelR);
    ctx.strokeStyle = style.tileBorder; ctx.stroke();

    const pad = inset + u * .065;
    if (style.ribbon) {
      /* gift wrap: one band down the gap between number and icon, one across above the label */
      const band = u * .08, ry = h * .3, rx = w * (L.compact ? .6 : .56);
      ctx.fillStyle = SPEC.color.gold;
      ctx.fillRect(rx - band / 2, 0, band, h);
      ctx.fillRect(0, ry - band / 2, w, band);
      ctx.fillStyle = 'rgba(120,70,20,.22)';
      ctx.fillRect(rx - band / 2, 0, band * .18, h); ctx.fillRect(0, ry + band * .32, w, band * .18);
      if (style.bow) {
        /* the bow: two loops and two tails where the bands cross */
        const bx = rx, by = ry, lw = u * .14, lh = u * .09;
        ctx.lineWidth = Math.max(2, u * .03); ctx.strokeStyle = SPEC.color.gold; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath(); ctx.ellipse(bx - lw * .55, by - lh * .15, lw * .55, lh * .5, -.35, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(bx + lw * .55, by - lh * .15, lw * .55, lh * .5, .35, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx - lw * .45, by + lh * .7); ctx.moveTo(bx, by); ctx.lineTo(bx + lw * .45, by + lh * .7); ctx.stroke();
        ctx.beginPath(); ctx.arc(bx, by, u * .035, 0, Math.PI * 2); ctx.fillStyle = '#e2b44f'; ctx.fill();
        /* a few stars on the paper */
        ctx.fillStyle = 'rgba(243,201,105,.75)'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.font = `600 ${u * .08}px ${FONT}`;
        for (const [sx, sy] of [[.2, .17], [.86, .16], [.88, .5]]) ctx.fillText('✦', w * sx, h * sy);
      }
    }

    if (style.drift) {
      /* cold light: white at the top fading to a hint of ice blue */
      const cold = ctx.createLinearGradient(0, 0, 0, h);
      cold.addColorStop(0, 'rgba(255,255,255,.35)'); cold.addColorStop(1, 'rgba(150,186,216,.25)');
      ctx.fillStyle = cold; ctx.fillRect(0, 0, w, h);
      /* the drift: soft bumps of snow sitting on the top edge, with a blue shadow underneath */
      const bumps = L.compact ? 4 : 5, edge = h * .15;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(w, 0); ctx.lineTo(w, edge * .8);
      for (let i = bumps; i >= 0; i--) {
        const x = w * i / bumps, depth = edge * (i % 2 ? 1.35 : .9) + edge * .25 * Math.sin(i * 2.1 + d.day.dia);
        ctx.quadraticCurveTo(x + w / bumps / 2, depth + edge * .55, x, depth);
      }
      ctx.closePath();
      ctx.save();
      ctx.shadowColor = 'rgba(80,116,150,.35)'; ctx.shadowBlur = u * .03; ctx.shadowOffsetY = u * .014;
      ctx.fillStyle = '#ffffff'; ctx.fill();
      ctx.restore();
      /* falling snow: white flakes and a few glints on the frost */
      ctx.fillStyle = '#ffffff';
      for (const [gx, gy, gr] of [[.12, .36, .018], [.3, .3, .012], [.5, .4, .015], [.72, .32, .02], [.9, .42, .013], [.84, .62, .011], [.2, .52, .01], [.62, .5, .009]]) { ctx.beginPath(); ctx.arc(w * gx, h * gy, u * gr, 0, Math.PI * 2); ctx.fill(); }
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `600 ${u * .07}px ${FONT}`;
      for (const [gx, gy] of [[.4, .3], [.88, .3]]) ctx.fillText('✦', w * gx, h * gy);
    }
    if (style.snow) {
      /* snowflakes: three crossed strokes with little branches, like a knitted jumper */
      ctx.strokeStyle = 'rgba(255,249,236,.4)'; ctx.lineCap = 'round';
      for (const [fx, fy, fr] of [[.17, .2, .07], [.84, .2, .08], [.66, .1, .045], [.9, .52, .05], [.38, .14, .04]]) {
        const x = w * fx, y = h * fy, r = u * fr;
        ctx.lineWidth = Math.max(1, r * .16);
        for (let k = 0; k < 3; k++) {
          const a = k * Math.PI / 3, dx = Math.cos(a) * r, dy = Math.sin(a) * r;
          ctx.beginPath(); ctx.moveTo(x - dx, y - dy); ctx.lineTo(x + dx, y + dy); ctx.stroke();
          for (const sgn of [1, -1]) {
            const bx = x + sgn * dx * .6, by = y + sgn * dy * .6, b = r * .3;
            ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + Math.cos(a + sgn * 2.4) * b, by + Math.sin(a + sgn * 2.4) * b);
            ctx.moveTo(bx, by); ctx.lineTo(bx + Math.cos(a - sgn * 2.4) * b, by + Math.sin(a - sgn * 2.4) * b); ctx.stroke();
          }
        }
      }
    }

    /* number and icon share a baseline at the bottom of the panel */
    const numSize = u * (L.compact ? .38 : .36);
    const base = h - pad;
    if (style.cane) {
      /* candy-cane stripes, then a cream tag under the label, number and icon so they stay legible */
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();
      ctx.fillStyle = '#c8323f'; const stripe = u * .09;
      for (let x = -h; x < w + h; x += stripe * 2.4) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + stripe, 0); ctx.lineTo(x + stripe - h * .8, h); ctx.lineTo(x - h * .8, h); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
      const tagLabel = u * (L.compact ? .13 : .115);
      const tagTop = base - numSize * .78 - tagLabel * 1.6, tagX = pad - u * .06;
      roundRect(ctx, tagX, tagTop, w - tagX * 2, base + u * .05 - tagTop, u * .06);
      ctx.fillStyle = style.bg; ctx.fill();
      ctx.lineWidth = Math.max(1, u * .008); ctx.strokeStyle = style.tileBorder; ctx.stroke();
    }
    ctx.fillStyle = style.ink; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.font = `600 ${numSize}px ${FONT}`;
    if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing:string }).letterSpacing = `${(-numSize * .02).toFixed(1)}px`;
    ctx.fillText(String(d.day.dia).padStart(2, '0'), pad - u * .01, base);
    if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing:string }).letterSpacing = '0px';
    const r = u * .14, cx = w - pad - r, cy = base - numSize * .36;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = style.ribbon ? style.bg : style.tile; ctx.fill();
    ctx.fillStyle = style.tile; ctx.fill();
    ctx.lineWidth = Math.max(1, u * .007); ctx.strokeStyle = style.tileBorder; ctx.stroke();
    if (icon) ctx.drawImage(icon, cx - r * .62, cy - r * .62, r * 1.24, r * 1.24);

    /* state, in the free band just above the number (the pull keeps the top edge) */
    const labelSize = u * (L.compact ? .13 : .115);
    const mid = base - numSize * .78 - labelSize * .75;
    ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    ctx.font = `600 ${labelSize}px ${FONT}`;
    if (d.state === 'future') {
      const milestone = d.day.dia === 24 ? 'Nochebuena' : d.day.dia === 15 ? '¡Mitad!' : d.day.dia === 1 ? '¡Empieza!' : '';
      const date = milestone && !L.compact ? milestone : shortDate(d.day.abre_el);
      const lw = labelSize * .72, lh = labelSize * .6, lx = pad, ly = mid - lh * .3;
      const textW = ctx.measureText(date).width, plateW = lw + labelSize * .4 + textW + labelSize * .7;
      if (style.ribbon) {
        /* on wrapping paper the label sits on a small plate so the ribbon never cuts it */
        roundRect(ctx, lx - labelSize * .35, mid - labelSize * .72, plateW, labelSize * 1.44, labelSize * .72);
        ctx.fillStyle = style.bg; ctx.fill();
      }
      ctx.lineWidth = Math.max(1.4, labelSize * .12); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.strokeStyle = style.ink; ctx.globalAlpha = .85;
      roundRect(ctx, lx, ly, lw, lh, lw * .18); ctx.stroke();
      ctx.beginPath(); ctx.arc(lx + lw / 2, ly, lw * .3, Math.PI, 0); ctx.stroke();
      ctx.fillStyle = style.ink; ctx.fillText(date, lx + lw + labelSize * .4, mid + labelSize * .04);
      ctx.globalAlpha = 1;
    } else if (d.state === 'available') {
      const label = 'Ábrelo', tw = ctx.measureText(label).width, ph = labelSize * 1.5, px = labelSize * .6;
      roundRect(ctx, pad - px * .5, mid - ph / 2, tw + px * 2, ph, ph / 2);
      /* every drawer keeps its colour, so «Ábrelo» is always the yellow pill */
      ctx.fillStyle = SPEC.color.gold; ctx.fill();
      ctx.fillStyle = '#691b32';
      ctx.fillText(label, pad - px * .5 + px, mid + labelSize * .04);
    }
  }

  /* repaint a front only when what it shows changes (its state or the layout) */
  function paintFront(d:Drawer) {
    if (d.state === 'opened' || d.state === 'completed') return;
    const style = frontStyle(d.index, L.cols, d.state, d.day);
    const key = `${d.state}|${L.cols}`;
    if (d.frontDrawn === key) return;
    d.frontDrawn = key;
    d.box.color.set(style.bg);
    const canvas = d.face.image as HTMLCanvasElement;
    const draw = (img:HTMLImageElement|null) => { drawFront(canvas.getContext('2d')!, canvas.width, canvas.height, d, style, img); d.face.needsUpdate = true; };
    draw(null);
    icons.get(dayIcon(d.day.dia), style.ink).then(img => { if (img && d.frontDrawn === key && drawers.includes(d)) { draw(img); requestRender(); } });
  }

  /*
   * The card inside an opened drawer (DESIGN.md: warm-white surface, cherry ink, yellow = done).
   * It sits just behind the facade, but the camera looks in at an angle, so the hole's rim
   * can still hide a strip of it: everything stays inside a safe margin sized for the widest yaw.
   * Opened and completed differ by shape and words too, not only colour.
   */
  function drawInterior(ctx:CanvasRenderingContext2D, w:number, h:number, day:DayInfo, completed:boolean, icon:HTMLImageElement|null) {
    const u = Math.min(w, h);
    const cherry = '#691b32';
    const padX = w * .12, padTop = h * .11, padBottom = h * .1;
    /* done is Christmas green: a holly-green stamp on a faint green card */
    ctx.fillStyle = completed ? SPEC.color.hollySoft : '#fffaf1'; ctx.fillRect(0, 0, w, h);
    /* soft light from above, like the drawer's own shadow falling on the card */
    const top = ctx.createLinearGradient(0, 0, 0, h * .3);
    top.addColorStop(0, 'rgba(59,37,45,.16)'); top.addColorStop(1, 'rgba(59,37,45,0)');
    ctx.fillStyle = top; ctx.fillRect(0, 0, w, h * .3);

    /* top row: which day this is, and its state in words */
    ctx.textBaseline = 'middle';
    const rowY = padTop + u * .06;
    ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(105,27,50,.78)';
    ctx.font = `600 ${u * .13}px ${FONT}`;
    ctx.fillText(String(day.dia).padStart(2, '0'), padX, rowY);
    /* a drawn check, not a glyph: same stroke language as the icon set */
    const check = (cx:number, cy:number, s:number) => {
      ctx.beginPath(); ctx.moveTo(cx - s, cy); ctx.lineTo(cx - s * .25, cy + s * .75); ctx.lineTo(cx + s * 1.1, cy - s * .8);
      ctx.lineWidth = Math.max(1.5, u * .018); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = SPEC.color.icing; ctx.stroke();
    };
    if (L.compact) {
      /* on phones a word this small can't be read: the state becomes a shape, and the title gets the room */
      if (completed) {
        const sr = u * .1, sx = w - padX - sr, sy = rowY;
        ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fillStyle = SPEC.color.holly; ctx.fill();
        check(sx, sy, sr * .42);
      }
    } else {
      const label = completed ? 'Hecho' : 'Por hacer';
      ctx.font = `600 ${u * .095}px ${FONT}`;
      const labelW = ctx.measureText(label).width;
      const pillH = u * .155, pillPad = u * .06, stamp = completed ? pillH : 0;
      const pillW = labelW + pillPad * 2 + stamp * .55;
      const pillX = w - padX - pillW, pillY = rowY - pillH / 2;
      roundRect(ctx, pillX, pillY, pillW, pillH, pillH / 2);
      ctx.fillStyle = completed ? SPEC.color.holly : 'rgba(105,27,50,.08)'; ctx.fill();
      ctx.fillStyle = completed ? SPEC.color.icing : cherry; ctx.textAlign = 'left';
      ctx.fillText(label, pillX + pillPad + stamp * .55, rowY + u * .004);
      if (completed) check(pillX + pillPad + stamp * .2, rowY, stamp * .2);
    }

    /* the day's icon */
    const r = u * .14, cx = w / 2, cy = h * .42;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = completed ? SPEC.color.holly : '#e9d4d9'; ctx.fill();
    if (icon) ctx.drawImage(icon, cx - r * .58, cy - r * .58, r * 1.16, r * 1.16);

    /* the title: as large as fits in three lines, shrinking before it would ever be cut */
    const maxW = w - padX * 2, areaTop = cy + r + u * .05, areaBottom = h - padBottom * .8;
    let size = u * (L.compact ? .17 : .135), lines:string[] = [];
    for (; size > u * .07; size *= .94) {
      ctx.font = `600 ${size}px ${FONT}`;
      lines = wrapLines(ctx, day.titulo, maxW, 3);
      const fits = !lines.at(-1)?.endsWith('…') && lines.every(line => ctx.measureText(line).width <= maxW);
      if (fits && lines.length * size * 1.12 <= areaBottom - areaTop) break;
    }
    ctx.font = `600 ${size}px ${FONT}`; ctx.fillStyle = cherry; ctx.textAlign = 'center';
    /* balance the lines (like text-wrap:balance) so no word is left alone on the last one */
    if (lines.length > 1) {
      let lo = maxW * .45, hi = maxW;
      for (let i = 0; i < 12; i++) {
        const mid = (lo + hi) / 2;
        if (wrapLines(ctx, day.titulo, mid, lines.length).some(line => line.endsWith('…'))) lo = mid; else hi = mid;
      }
      lines = wrapLines(ctx, day.titulo, hi, lines.length);
    }
    const lineH = size * 1.12;
    const start = areaTop + (areaBottom - areaTop - lines.length * lineH) / 2 + lineH / 2;
    lines.forEach((line, i) => ctx.fillText(line, cx, start + i * lineH));
  }

  /* ---------- model ---------- */
  function buildHouse() {
    const root = new THREE.Group();
    const { bodyW, bodyH, gable, depth } = L;
    const grain = grainTexture();
    const planks = plankTexture();
    const facadeFront = mat({ color:SPEC.color.facade, map:grain, roughness:.8, metalness:0 });
    const facadeSide = mat({ color:SPEC.color.side, map:planks, roughness:.82 });
    const icing = mat({ color:SPEC.color.icing, roughness:.38, metalness:0, envMapIntensity:.8 });
    /* piping on the facade: cherry, so it reads against the warm white */
    const piping = mat({ color:SPEC.color.onFacade, roughness:.45, metalness:0 });
    const gold = mat({ color:SPEC.color.gold, roughness:.32, metalness:.45 });

    /* facade + body: one extruded house profile with 24 drawer openings */
    const outline = new THREE.Shape();
    outline.moveTo(-bodyW / 2, 0); outline.lineTo(bodyW / 2, 0); outline.lineTo(bodyW / 2, bodyH);
    outline.lineTo(0, bodyH + gable); outline.lineTo(-bodyW / 2, bodyH); outline.closePath();
    const bevel = { size:.035, thick:.05 };
    for (let i = 0; i < 24; i++) {
      const c = cellCenter(L, i);
      outline.holes.push(roundedRectShape(c.x, c.y, L.cellW + L.holePad, L.cellH + L.holePad, .045, new THREE.Path()));
    }
    const bodyGeo = geo(new THREE.ExtrudeGeometry(outline, { depth, bevelEnabled:true, bevelSize:bevel.size, bevelThickness:bevel.thick, bevelSegments:4, curveSegments:6 }));
    const body = shadowed(new THREE.Mesh(bodyGeo, [facadeFront, facadeSide]));
    body.position.z = -(depth + bevel.thick);
    root.add(body);

    /* back panel: closes the openings so the cavities read as drawers, not holes. A warm shade a
       little darker than the facade: a dark lining showed as flickering black edges round the drawers */
    const liner = mat({ color:SPEC.color.liner, roughness:.9, side:THREE.BackSide });
    const linerGeo = geo(new THREE.BoxGeometry(L.cellW + L.holePad - 2 * bevel.size, L.cellH + L.holePad - 2 * bevel.size, .56));
    const rimGeo = geo(new THREE.ExtrudeGeometry((() => {
      const s = roundedRectShape(0, 0, L.cellW + L.holePad + L.rimPad, L.cellH + L.holePad + L.rimPad, .05);
      s.holes.push(roundedRectShape(0, 0, L.cellW + L.holePad, L.cellH + L.holePad, .045, new THREE.Path()));
      return s;
    })(), { depth:.02, bevelEnabled:true, bevelSize:.008, bevelThickness:.012, bevelSegments:3, curveSegments:6 }));
    const frontGeo = geo(new RoundedBoxGeometry(L.cellW - .02, L.cellH - .02, .12, 3, .022));
    const facePlaneGeo = geo(new THREE.PlaneGeometry(L.cellW - .05, L.cellH - .05));
    const interiorGeo = geo(new THREE.PlaneGeometry(L.cellW + L.holePad - 2 * bevel.size, L.cellH + L.holePad - 2 * bevel.size));
    const pullGeo = geo(new RoundedBoxGeometry(.2, .048, .05, 3, .021));
    const trayDepth = .44;
    const traySide = geo(new THREE.BoxGeometry(.035, L.cellH * .62, trayDepth));
    const trayBottom = geo(new THREE.BoxGeometry(L.cellW - .1, .035, trayDepth));
    const trayBack = geo(new THREE.BoxGeometry(L.cellW - .1, L.cellH * .62, .035));

    drawers = days.slice(0, 24).map((day, i) => {
      const { x, y } = cellCenter(L, i);
      const cavity = new THREE.Mesh(linerGeo, liner); cavity.position.set(x, y, -.3); cavity.receiveShadow = true; root.add(cavity);
      const rimMat = mat({ color:SPEC.color.rimMuted, roughness:.55, metalness:.1, emissive:SPEC.color.gold, emissiveIntensity:0 });
      const rimMesh = shadowed(new THREE.Mesh(rimGeo, rimMat), true, true); rimMesh.position.set(x, y, -.012); root.add(rimMesh);

      /* the opened card sits just behind the facade: deep enough to read as a drawer, shallow
         enough that the rim never hides the title when the camera looks in from the side */
      const interiorMat = mat({ color:'#ffffff', roughness:.85, emissive:'#ffffff', emissiveIntensity:.32 });
      const interior = new THREE.Mesh(interiorGeo, interiorMat); interior.position.set(x, y, SPEC.cardZ.rest); interior.receiveShadow = true; interior.visible = false; root.add(interior);

      const group = new THREE.Group(); group.position.set(x, y, 0);
      const boxMat = mat({ color:SPEC.fronts.cream.bg, roughness:.6 });
      const faceTex = canvasTexture((L.cellW - .05) * ppu, (L.cellH - .05) * ppu, () => {});
      const faceMat = mat({ map:faceTex, roughness:.5 });
      /* the brass pull: the one physical detail that makes it a drawer, not a tile */
      const pullMat = mat({ color:SPEC.color.gold, roughness:.28, metalness:.6 });
      const trayMat = mat({ color:SPEC.color.tray, roughness:.7 });
      const front = shadowed(new THREE.Mesh(frontGeo, boxMat)); front.position.z = -.08;
      const face = new THREE.Mesh(facePlaneGeo, faceMat); face.position.z = -.019; face.receiveShadow = true;
      const tz = -.14 - trayDepth / 2, ty = -L.cellH * .12;
      const left = new THREE.Mesh(traySide, trayMat); left.position.set(-(L.cellW / 2 - .07), ty, tz);
      const right = new THREE.Mesh(traySide, trayMat); right.position.set(L.cellW / 2 - .07, ty, tz);
      const bottom = new THREE.Mesh(trayBottom, trayMat); bottom.position.set(0, ty - L.cellH * .31, tz);
      const back = new THREE.Mesh(trayBack, trayMat); back.position.set(0, ty, tz - trayDepth / 2);
      const pull = shadowed(new THREE.Mesh(pullGeo, pullMat), true, false); pull.position.set(0, L.cellH / 2 - (L.compact ? .15 : .13), .012);
      group.add(front, face, pull, left, right, bottom, back);
      root.add(group);
      const drawer:Drawer = { day, x, y, state:'future', group, materials:[boxMat, faceMat, trayMat, pullMat], rim:rimMat, interior, interiorMat, interiorDrawn:'', index:i, box:boxMat, face:faceTex, frontDrawn:'', pull:0, openStart:-1, button:null };
      return drawer;
    });

    /* eave band: thick piping line, star row, thin piping line */
    const eaveTop = L.gridTop + .14 + L.eaveH;
    const barTop = shadowed(new THREE.Mesh(geo(new RoundedBoxGeometry(bodyW - .06, .075, .07, 2, .03)), piping)); barTop.position.set(0, eaveTop - .05, .02);
    const barLow = shadowed(new THREE.Mesh(geo(new RoundedBoxGeometry(bodyW - .2, .032, .04, 2, .014)), piping)); barLow.position.set(0, L.gridTop + .14, .01);
    const starCount = L.cols * 2 - 1;
    const starH = L.eaveH - .14, starW = bodyW - .3;
    const stars = new THREE.Mesh(geo(new THREE.PlaneGeometry(starW, starH)), mat({ transparent:true, roughness:.5, map:canvasTexture(starW * ppu, starH * ppu, (ctx, w, h) => {
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = `600 ${h * .62}px ${FONT}`;
      for (let i = 0; i < starCount; i++) { ctx.fillStyle = i % 2 ? SPEC.color.facadeAccent : SPEC.color.onFacade; ctx.fillText(i % 2 ? '✧' : '✦', (i + .5) * w / starCount, h * .54); }
    }) }));
    stars.position.set(0, L.gridTop + .14 + .015 + starH / 2, .004);
    root.add(barTop, barLow, stars);

    /* plinth caption */
    const plinthW = L.gridW, plinthH = .3;
    const plinth = new THREE.Mesh(geo(new THREE.PlaneGeometry(plinthW, plinthH)), mat({ transparent:true, roughness:.6, map:canvasTexture(plinthW * ppu, plinthH * ppu, (ctx, w, h) => {
      ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.fillStyle = SPEC.color.onFacade;
      ctx.font = `400 ${h * (L.compact ? .52 : .46)}px ${FONT}`; ctx.fillText('Un pequeño descubrimiento cada día', 0, h * .52);
      ctx.textAlign = 'right'; ctx.fillStyle = SPEC.color.facadeAccent; ctx.font = `600 ${h * .75}px ${FONT}`; ctx.fillText('✦', w, h * .52);
    }) }));
    plinth.position.set(0, L.plinthH / 2 - .02, .003);
    root.add(plinth);

    /* gable insignia */
    const insW = bodyW * (L.compact ? .66 : .44), insH = insW * .4;
    const insignia = new THREE.Mesh(geo(new THREE.PlaneGeometry(insW, insH)), mat({ transparent:true, roughness:.5, map:canvasTexture(insW * ppu, insH * ppu, (ctx, w, h) => {
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      drawRosetteStar(ctx, w / 2, h * .2, h * .15, SPEC.color.facadeAccent);
      ctx.fillStyle = SPEC.color.onFacade; ctx.font = `600 ${h * .17}px ${FONT}`; ctx.fillText('24 pequeñas sorpresas', w / 2, h * .55);
      ctx.globalAlpha = .86; ctx.font = `400 ${h * .085}px ${FONT}`; spacedText(ctx, 'DICIEMBRE · 2026', w / 2, h * .78, h * .016);
    }) }));
    insignia.position.set(0, bodyH + gable * (L.compact ? .4 : .37), .004);
    root.add(insignia);

    /* scalloped cherry garland at the base of the gable */
    const garlandPts:THREE.Vector3[] = [];
    const gx0 = -bodyW / 2 + .35, gx1 = bodyW / 2 - .35, scallops = Math.round((gx1 - gx0) / .34);
    for (let i = 0; i <= scallops * 4; i++) {
      const t = i / (scallops * 4), x = gx0 + (gx1 - gx0) * t;
      garlandPts.push(new THREE.Vector3(x, bodyH + .13 - Math.abs(Math.sin(t * scallops * Math.PI)) * .075, .035));
    }
    const garland = shadowed(new THREE.Mesh(geo(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(garlandPts), scallops * 24, .03, 8)), piping));
    root.add(garland);

    /* roof: two shingled slabs with icing on the front edge, icing drips and lights */
    const a = Math.atan2(gable, bodyW / 2), slope = Math.hypot(bodyW / 2, gable);
    const T = .2, overEave = .32, front = .3, back = .08, Dz = depth + front + back + .1;
    const Lr = slope + overEave + .02;
    const roofTop = mat({ map:shingleTexture(Lr, Dz), roughness:.7 });
    const roofSide = mat({ color:SPEC.color.roof, roughness:.8 });
    const roofUnder = mat({ color:SPEC.color.roofUnder, roughness:.9 });
    const slabGeo = geo(new THREE.BoxGeometry(Lr, T, Dz));
    const edgeGeo = geo(new THREE.CapsuleGeometry(.075, Lr - .02, 6, 16)); edgeGeo.rotateZ(Math.PI / 2);
    const dripGeo = geo(new THREE.SphereGeometry(.05, 14, 10));
    const bulbGeo = geo(new THREE.SphereGeometry(.042, 14, 10));
    const bulbMat = track(new THREE.MeshBasicMaterial({ color:'#ffffff', toneMapped:false }));
    const roofZ = -(depth / 2) + (front - back) / 2;
    bulbs = [];
    for (const side of [-1, 1]) {
      const slab = new THREE.Group();
      const n = new THREE.Vector2(side * Math.sin(a), Math.cos(a));
      const toEave = new THREE.Vector2(side * Math.cos(a), -Math.sin(a));
      const mid = new THREE.Vector2(side * bodyW / 4, bodyH + gable / 2);
      const shift = (overEave - .02) / 2;
      slab.position.set(mid.x + n.x * T / 2 + toEave.x * shift, mid.y + n.y * T / 2 + toEave.y * shift, roofZ);
      slab.rotation.z = -side * a;
      const box = shadowed(new THREE.Mesh(slabGeo, [roofSide, roofSide, roofTop, roofUnder, icing, roofSide]));
      const edge = shadowed(new THREE.Mesh(edgeGeo, icing)); edge.position.set(0, -T / 2 + .03, Dz / 2 - .02);
      const top = shadowed(new THREE.Mesh(edgeGeo, icing)); top.position.set(0, T / 2 - .01, Dz / 2 - .04); top.scale.set(1, .7, .7);
      slab.add(box, edge, top);
      const rand = rng(side > 0 ? 7 : 11);
      const dripCount = Math.round(Lr / .2);
      const drips = shadowed(new THREE.InstancedMesh(dripGeo, icing, dripCount));
      const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
      for (let i = 0; i < dripCount; i++) {
        const k = .7 + rand() * .7;
        p.set(-Lr / 2 + .12 + i * (Lr - .24) / (dripCount - 1), -T / 2 - .02 - k * .03, Dz / 2 - .015);
        q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), side * a);
        s.set(k * .9, k * 1.5, k * .9);
        drips.setMatrixAt(i, m.compose(p, q, s));
      }
      const bulbCount = Math.max(6, Math.round(Lr / .42));
      const lights = new THREE.InstancedMesh(bulbGeo, bulbMat, bulbCount);
      for (let i = 0; i < bulbCount; i++) {
        p.set(-Lr / 2 + .3 + i * (Lr - .6) / (bulbCount - 1), -T / 2 - .17 - (i % 2) * .03, Dz / 2 + .02);
        lights.setMatrixAt(i, m.compose(p, new THREE.Quaternion(), new THREE.Vector3(1, 1, 1)));
        lights.setColorAt(i, new THREE.Color(i % 2 ? '#b8435f' : '#fff6e2'));
      }
      bulbs.push(lights);
      slab.add(drips, lights);
      root.add(slab);
    }
    const ridge = shadowed(new THREE.Mesh(geo(new THREE.CapsuleGeometry(.11, Dz - .1, 6, 16)), icing));
    ridge.rotation.x = Math.PI / 2; ridge.position.set(0, bodyH + gable + T / Math.cos(a) - .02, roofZ);
    root.add(ridge);

    /* chimney with snow cap */
    const cx = -bodyW * .27, roofAt = bodyH + gable * (1 - Math.abs(cx) / (bodyW / 2)) + T / Math.cos(a);
    const chimH = (L.compact ? .62 : .7) + .5;
    const chimney = shadowed(new THREE.Mesh(geo(new RoundedBoxGeometry(.48, chimH, .48, 2, .03)), mat({ color:SPEC.color.chimney, map:grain, roughness:.8 })));
    chimney.position.set(cx, roofAt - .5 + chimH / 2, -depth * .4);
    const cap = shadowed(new THREE.Mesh(geo(new RoundedBoxGeometry(.6, .16, .6, 3, .07)), icing));
    cap.position.set(cx, roofAt - .5 + chimH + .03, -depth * .4);
    root.add(chimney, cap);

    /* pines */
    const pine = mat({ color:SPEC.color.pine, roughness:.85, flatShading:true });
    const snow = mat({ color:SPEC.color.snow, roughness:.6, flatShading:true });
    const trunk = mat({ color:SPEC.color.trunk, roughness:.8 });
    function tree(scale:number, star:boolean) {
      const t = new THREE.Group();
      const stem = shadowed(new THREE.Mesh(geo(new THREE.CylinderGeometry(.09, .11, .45, 10)), trunk)); stem.position.y = .22; t.add(stem);
      [[.62, .95, .35], [.5, .82, .85], [.36, .68, 1.3]].forEach(([r, h, y], i) => {
        const tier = shadowed(new THREE.Mesh(geo(new THREE.ConeGeometry(r, h, 7)), pine)); tier.position.y = y + h / 2; tier.rotation.y = i * .45;
        const tip = shadowed(new THREE.Mesh(geo(new THREE.ConeGeometry(r * .5, h * .46, 7)), snow)); tip.position.y = y + h - h * .23 + .012; tip.rotation.y = i * .45; tip.scale.setScalar(1.05);
        t.add(tier, tip);
      });
      if (star) {
        const shape = new THREE.Shape();
        for (let i = 0; i < 10; i++) { const r = i % 2 ? .07 : .16, an = Math.PI / 2 + i * Math.PI / 5; i ? shape.lineTo(Math.cos(an) * r, Math.sin(an) * r) : shape.moveTo(Math.cos(an) * r, Math.sin(an) * r); }
        const starMesh = shadowed(new THREE.Mesh(geo(new THREE.ExtrudeGeometry(shape, { depth:.04, bevelEnabled:true, bevelSize:.012, bevelThickness:.012, bevelSegments:2 })), gold));
        starMesh.position.set(0, 2.08, -.02); t.add(starMesh);
      }
      t.scale.setScalar(scale);
      return t;
    }
    const left = tree(L.compact ? .55 : 1.1, true), right = tree(L.compact ? .45 : .85, false);
    if (L.compact) { left.position.set(-bodyW / 2 - .25, 0, -.35); right.position.set(bodyW / 2 + .32, 0, .1); }
    else { left.position.set(-bodyW / 2 - .95, 0, .35); right.position.set(bodyW / 2 + .85, 0, .05); }
    root.add(left, right);

    /* easter egg: a caganer squatting behind the back-right corner, only visible once the house is turned */
    caganer = null;
    if (!caganerGone) {
      caganer = createCaganerModel(track);
      if (L.compact) { caganer.position.set(bodyW / 2 + .12, 0, -depth - .15); caganer.scale.setScalar(.66); }
      else { caganer.position.set(bodyW / 2 + .3, 0, -depth - .2); caganer.scale.setScalar(.85); }
      caganer.rotation.y = .75;
      root.add(caganer);
    }

    /* ground: shadow catcher + soft ambient occlusion under the house */
    const ground = new THREE.Mesh(geo(new THREE.PlaneGeometry(40, 40)), track(new THREE.ShadowMaterial({ color:SPEC.color.shadow, opacity:.12 })));
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; root.add(ground);
    const ao = new THREE.Mesh(geo(new THREE.PlaneGeometry(bodyW * 1.5, depth * 2.6)), track(new THREE.MeshBasicMaterial({ transparent:true, depthWrite:false, map:canvasTexture(256, 256, (ctx, w, h) => {
      const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
      g.addColorStop(0, 'rgba(59,18,37,.32)'); g.addColorStop(.55, 'rgba(59,18,37,.12)'); g.addColorStop(1, 'rgba(59,18,37,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    }) })));
    ao.rotation.x = -Math.PI / 2; ao.position.set(0, .002, -depth / 2); root.add(ao);

    /* key light frames the whole model so the shadow map stays sharp */
    const span = bodyW / 2 + 2.2;
    key.position.set(-bodyW * .55, bodyH + gable + 5, 7.5);
    key.target.position.set(0, bodyH / 2, -depth / 2);
    Object.assign(key.shadow.camera, { left:-span, right:span, top:span + 1, bottom:-span, near:.5, far:30 });
    key.shadow.camera.updateProjectionMatrix();
    key.shadow.mapSize.set(L.compact ? 1536 : 2048, L.compact ? 1536 : 2048);
    key.shadow.map?.dispose(); key.shadow.map = null;
    rim.position.set(bodyW, bodyH + 3, -6);
    return root;
  }

  function rebuild() {
    world.remove(house);
    disposables.forEach(item => item.dispose()); disposables.clear();
    house = buildHouse(); world.add(house);
    renderer.shadowMap.needsUpdate = true;
    sync();
  }

  /* ---------- sizing & camera ---------- */
  /* the house only turns while someone drags it; `goal` is where the drag wants it, `view` eases there */
  const goal = { yaw:SPEC.camera.yaw, pitch:SPEC.camera.pitch };
  const view = { ...goal };
  const target = new THREE.Vector3();
  let baseDistance = 10;

  function resize(force = false) {
    const width = scene.clientWidth; if (!width) return;
    const compact = compactQuery.matches;
    const changedLayout = compact !== L.compact;
    if (!force && !changedLayout && Math.abs(width - sceneWidth) < 1) return;
    sceneWidth = width;
    L = layoutFor(compact);
    const frameW = L.frame.right - L.frame.left, frameH = L.frame.top - L.frame.bottom;
    const height = Math.round(width * frameH / frameW);
    scene.style.height = `${height}px`;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr); renderer.setSize(width, height, false);
    camera.aspect = width / height;
    const tan = Math.tan(THREE.MathUtils.degToRad(SPEC.camera.fov / 2));
    baseDistance = (frameH / 2) / tan + L.depth * .42;
    target.set((L.frame.left + L.frame.right) / 2, (L.frame.top + L.frame.bottom) / 2, -L.depth * .42);
    camera.updateProjectionMatrix();
    const nextPpu = THREE.MathUtils.clamp(Math.round(width / frameW * dpr * 1.15), 192, 448);
    if (changedLayout || force || Math.abs(nextPpu - ppu) > 48) { ppu = nextPpu; rebuild(); }
  }

  function placeCamera() {
    const { yaw, pitch } = view;
    camera.position.set(
      target.x + Math.sin(yaw) * Math.cos(pitch) * baseDistance,
      target.y + Math.sin(pitch) * baseDistance,
      target.z + Math.cos(yaw) * Math.cos(pitch) * baseDistance
    );
    camera.lookAt(target);
    camera.updateMatrixWorld();
  }

  /* ---------- DOM drawers ↔ 3D drawers ---------- */
  const corner = new THREE.Vector3();
  function placeButtons() {
    const w = scene.clientWidth, h = scene.clientHeight;
    const hw = L.cellW / 2, hh = L.cellH / 2;
    for (const d of drawers) {
      if (!d.button) continue;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
        corner.set(d.x + sx * hw, d.y + sy * hh, 0).project(camera);
        const px = (corner.x + 1) / 2 * w, py = (1 - corner.y) / 2 * h;
        minX = Math.min(minX, px); maxX = Math.max(maxX, px); minY = Math.min(minY, py); maxY = Math.max(maxY, py);
      }
      const s = d.button.style;
      s.transform = `translate3d(${minX.toFixed(1)}px,${minY.toFixed(1)}px,0)`;
      s.width = `${(maxX - minX).toFixed(1)}px`; s.height = `${(maxY - minY).toFixed(1)}px`;
    }
  }

  function stateOf(button:HTMLButtonElement):DoorState {
    const c = button.classList;
    return c.contains('completed') ? 'completed' : c.contains('opened') ? 'opened' : c.contains('available') ? 'available' : 'future';
  }

  function showInterior(d:Drawer) {
    const completed = d.state === 'completed';
    const key = completed ? 'done' : 'open';
    d.interior.visible = true;
    if (d.interiorDrawn === key) return;
    d.interiorDrawn = key;
    const w = L.cellW * ppu, h = L.cellH * ppu;
    const old = d.interiorMat.map;
    const tex = canvasTexture(w, h, (ctx, cw, ch) => drawInterior(ctx, cw, ch, d.day, completed, null));
    d.interiorMat.map = tex; d.interiorMat.emissiveMap = tex; d.interiorMat.needsUpdate = true;
    if (old) { old.dispose(); disposables.delete(old); }
    icons.get(dayIcon(d.day.dia), completed ? SPEC.color.icing : '#691b32').then(img => {
      if (!img || d.interiorMat.map !== tex) return;
      drawInterior((tex.image as HTMLCanvasElement).getContext('2d')!, tex.image.width, tex.image.height, d.day, completed, img);
      tex.needsUpdate = true;
    });
  }

  function setOpacity(d:Drawer, value:number) {
    for (const m of d.materials) { m.transparent = value < 1; m.opacity = value; }
  }

  function sync() {
    const buttons = [...grid.querySelectorAll<HTMLButtonElement>('.calendar-door')];
    drawers.forEach((d, i) => {
      const button = buttons[i] || null; d.button = button;
      const next = button ? stateOf(button) : 'future';
      const opening = Boolean(button?.classList.contains('opening'));
      const wasOpen = d.state === 'opened' || d.state === 'completed' || d.openStart >= 0;
      if (opening && !wasOpen) {
        d.state = 'opened'; showInterior(d);
        if (reduceMotion.matches) { d.group.visible = false; d.interior.position.z = SPEC.cardZ.rest; }
        else { d.openStart = performance.now(); setOpacity(d, 1); d.interior.position.z = SPEC.cardZ.behindTray; }
      } else if (next === 'opened' || next === 'completed') {
        d.state = next; showInterior(d);
        if (d.openStart < 0) { d.group.visible = false; d.interior.position.z = SPEC.cardZ.rest; }
      } else {
        d.state = next; d.openStart = -1; d.group.visible = true; d.group.position.set(d.x, d.y, 0); setOpacity(d, 1);
        d.interior.visible = false;
      }
      paintFront(d);
      /* yellow only marks «Ábrelo»; done is holly, opened a soft cherry (DESIGN.md) */
      d.rim.color.set(d.state === 'available' ? SPEC.color.gold : d.state === 'completed' ? SPEC.color.holly : d.state === 'opened' ? SPEC.color.rimOpen : SPEC.color.rimMuted);
    });
    renderer.shadowMap.needsUpdate = true;
    placeButtons();
    requestRender();
  }

  let hovered = -1, focused = -1;
  const indexOf = (el:EventTarget|null) => {
    const button = (el as HTMLElement|null)?.closest?.('.calendar-door');
    return button ? drawers.findIndex(d => d.button === button) : -1;
  };
  grid.addEventListener('pointerover', e => { hovered = indexOf(e.target); requestRender(); });
  grid.addEventListener('pointerleave', () => { hovered = -1; requestRender(); });
  grid.addEventListener('focusin', e => { focused = indexOf(e.target); requestRender(); });
  grid.addEventListener('focusout', () => { focused = -1; requestRender(); });
  /* drag to turn: a press that travels past the threshold becomes a drag and never opens a drawer */
  let drag:{ id:number; x:number; y:number; yaw:number; pitch:number; touch:boolean; moved:boolean }|null = null;
  let swallowClick = false;
  scene.addEventListener('pointerdown', e => {
    if (drag || (e.pointerType === 'mouse' && e.button !== 0) || scene.closest('.is-locked')) return;
    drag = { id:e.pointerId, x:e.clientX, y:e.clientY, yaw:goal.yaw, pitch:goal.pitch, touch:e.pointerType !== 'mouse', moved:false };
  });
  scene.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved) {
      if (Math.hypot(dx, dy) < 6 || (drag.touch && Math.abs(dy) > Math.abs(dx))) return;
      drag.moved = true; hovered = -1;
      scene.setPointerCapture(e.pointerId); scene.classList.add('is-dragging');
    }
    e.preventDefault();
    const [minYaw, maxYaw] = SPEC.camera.yawRange, [minPitch, maxPitch] = SPEC.camera.pitchRange;
    goal.yaw = THREE.MathUtils.clamp(drag.yaw - dx * SPEC.camera.dragSpeed, minYaw, maxYaw);
    if (!drag.touch) goal.pitch = THREE.MathUtils.clamp(drag.pitch + dy * SPEC.camera.dragSpeed * .6, minPitch, maxPitch);
    requestRender();
  });
  function endDrag(e:PointerEvent) {
    if (!drag || e.pointerId !== drag.id) return;
    if (drag.moved) { swallowClick = true; setTimeout(() => { swallowClick = false; }, 0); }
    if (scene.hasPointerCapture(e.pointerId)) scene.releasePointerCapture(e.pointerId);
    scene.classList.remove('is-dragging'); drag = null;
  }
  scene.addEventListener('pointerup', endDrag);
  scene.addEventListener('pointercancel', endDrag);
  scene.addEventListener('click', e => { if (swallowClick) { e.preventDefault(); e.stopPropagation(); swallowClick = false; } }, true);

  /* ---------- caganer easter egg ---------- */
  const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
  function caganerAt(e:PointerEvent|MouseEvent) {
    if (!caganer || poof || scene.closest('.is-locked')) return false;
    const rect = canvas.getBoundingClientRect();
    pointer.set((e.clientX - rect.left) / rect.width * 2 - 1, -(e.clientY - rect.top) / rect.height * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObject(caganer, true)[0];
    if (!hit) return false;
    /* the house must not be in front of it: only the peeking part is clickable */
    raycaster.far = hit.distance;
    const blocker = raycaster.intersectObject(house, true).find(h => !isCaganer(h.object));
    raycaster.far = Infinity;
    return !blocker;
  }
  const isCaganer = (obj:THREE.Object3D|null) => { for (let o = obj; o; o = o.parent) if (o === caganer) return true; return false; };
  scene.addEventListener('pointermove', e => {
    if (drag?.moved || e.pointerType !== 'mouse') return;
    scene.classList.toggle('is-pointing', caganerAt(e));
  });
  scene.addEventListener('click', e => {
    if (!caganerAt(e)) return;
    e.preventDefault();
    scene.classList.remove('is-pointing');
    vanish();
  });
  /* a studio portrait of the figure just found, for the dialog: same model, own little scene */
  let portrait:string|null|undefined;
  function caganerPortrait() {
    if (portrait !== undefined) return portrait;
    portrait = null;
    const owned:{ dispose():void }[] = [];
    const keep:Track = item => { owned.push(item); return item; };
    try {
      const size = 360;
      const shot = new THREE.WebGLRenderer({ antialias:true, alpha:true, preserveDrawingBuffer:true });
      owned.push(shot);
      shot.setPixelRatio(1); shot.setSize(size, size, false);
      shot.outputColorSpace = THREE.SRGBColorSpace; shot.toneMapping = renderer.toneMapping; shot.toneMappingExposure = renderer.toneMappingExposure;
      const stage = new THREE.Scene();
      const env = new THREE.PMREMGenerator(shot); const envMap = env.fromScene(new RoomEnvironment(), .04).texture; stage.environment = envMap; owned.push(envMap); env.dispose();
      stage.environmentIntensity = .55;
      const key = new THREE.DirectionalLight('#fff4e6', 2.4); key.position.set(1.5, 2.2, 2.5); stage.add(key);
      stage.add(new THREE.HemisphereLight('#fff6ec', '#3d5a45', 1.1));
      const figure = createCaganerModel(keep); figure.rotation.y = .55; stage.add(figure);
      const box = new THREE.Box3().setFromObject(figure), center = box.getCenter(new THREE.Vector3()), dims = box.getSize(new THREE.Vector3());
      const cam = new THREE.PerspectiveCamera(26, 1, .01, 50);
      const dist = Math.max(dims.x, dims.y, dims.z) / (2 * Math.tan(THREE.MathUtils.degToRad(13))) * 1.08;
      cam.position.set(center.x, center.y + dims.y * .18, center.z + dist); cam.lookAt(center.x, center.y - dims.y * .02, center.z);
      shot.render(stage, cam);
      portrait = shot.domElement.toDataURL('image/png');
      shot.forceContextLoss();
    } catch { portrait = null; }
    owned.forEach(item => item.dispose());
    return portrait;
  }
  const announceFound = () => scene.dispatchEvent(new CustomEvent('caganer-found', { bubbles:true, detail:{ portrait:caganerPortrait() } }));

  function vanish() {
    if (!caganer || poof) return;
    const box = new THREE.Box3().setFromObject(caganer), center = box.getCenter(new THREE.Vector3()), size = box.getSize(new THREE.Vector3());
    const puff = createSmokePuff(track, center, Math.max(size.x, size.y, size.z) * 1.1);
    world.add(puff.group);
    poof = { start:performance.now(), scale:caganer.scale.x, group:puff.group, update:puff.update, told:false };
    if (reduceMotion.matches) finishVanish();
    requestRender();
  }
  /* local development only: find the caganer from the console with __adviento.findCaganer() */
  if (import.meta.env.DEV) (window as unknown as { __adviento:object }).__adviento = { findCaganer:vanish };
  function finishVanish() {
    if (!poof) return;
    world.remove(poof.group);
    if (caganer) { caganer.removeFromParent(); caganer = null; }
    caganerGone = true; renderer.shadowMap.needsUpdate = true;
    if (!poof.told) announceFound();
    poof = null;
  }

  /* ---------- loop ---------- */
  let frame = 0, twinkle = 0, visible = true, dirty = true;
  const easeOut = (t:number) => 1 - Math.pow(1 - t, 3);
  function requestRender() { dirty = true; if (!frame && visible && !document.hidden) frame = requestAnimationFrame(tick); }
  scene.addEventListener('caganer-achievement-state', event => {
    if (!(event instanceof CustomEvent) || event.detail?.found !== true) return;
    caganerGone = true;
    if (caganer) { caganer.removeFromParent(); caganer = null; }
    renderer.shadowMap.needsUpdate = true;
    requestRender();
  });

  function tick(time:number) {
    frame = 0;
    const still = reduceMotion.matches;
    const locked = Boolean(scene.closest('.is-locked'));
    const k = still ? 1 : .22;
    view.yaw += (goal.yaw - view.yaw) * k; view.pitch += (goal.pitch - view.pitch) * k;
    placeCamera();

    let animating = Math.abs(goal.yaw - view.yaw) + Math.abs(goal.pitch - view.pitch) > .0005;
    drawers.forEach((d, i) => {
      if (d.openStart >= 0) {
        animating = true;
        const t = Math.min((time - d.openStart) / SPEC.openMs, 1);
        const pull = easeOut(Math.min(t / .62, 1)) * .72;
        const fade = THREE.MathUtils.clamp((t - .52) / .48, 0, 1);
        d.group.position.set(d.x, d.y - fade * fade * .18, pull);
        setOpacity(d, 1 - fade);
        /* once the tray is out, the card comes forward to its resting place */
        d.interior.position.z = THREE.MathUtils.lerp(SPEC.cardZ.behindTray, SPEC.cardZ.rest, easeOut(fade));
        if (t >= 1) { d.openStart = -1; d.group.visible = false; setOpacity(d, 1); d.interior.position.z = SPEC.cardZ.rest; }
        renderer.shadowMap.needsUpdate = true;
        return;
      }
      const active = (hovered === i || focused === i) && d.state === 'available' && !drag?.moved;
      const goalPull = active ? .1 : 0;
      if (Math.abs(goalPull - d.pull) > .001) {
        d.pull += (goalPull - d.pull) * (still ? 1 : .2); animating = true;
        d.group.position.z = d.pull; renderer.shadowMap.needsUpdate = true;
      }
      const glow = (hovered === i || focused === i) && d.state !== 'future' ? .35 : 0;
      if (Math.abs(d.rim.emissiveIntensity - glow) > .005) { d.rim.emissiveIntensity += (glow - d.rim.emissiveIntensity) * (still ? 1 : .2); animating = true; }
    });

    if (!still) {
      const c = new THREE.Color();
      bulbs.forEach((mesh, m) => {
        for (let i = 0; i < mesh.count; i++) {
          const pulse = .86 + .14 * Math.sin(time * .0021 + i * 1.7 + m * 2.3);
          c.set(i % 2 ? '#b8435f' : '#fff6e2').multiplyScalar(pulse * 1.2);
          mesh.setColorAt(i, c);
        }
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      });
    }

    if (poof) {
      animating = true;
      const elapsed = time - poof.start;
      if (caganer) {
        const t = Math.min(elapsed / 170, 1);
        caganer.scale.setScalar(poof.scale * (1 + .12 * Math.sin(t * Math.PI) - t * t));
        caganer.visible = t < 1; renderer.shadowMap.needsUpdate = true;
      }
      if (!poof.told && elapsed > 850) { poof.told = true; announceFound(); }
      if (!poof.update(Math.max(0, elapsed))) finishVanish();
    }

    renderer.render(world, camera);
    placeButtons();
    dirty = false;
    if (!visible || document.hidden) return;
    if (animating || dirty) frame = requestAnimationFrame(tick);
    else if (!still && !locked && !twinkle) twinkle = window.setTimeout(() => { twinkle = 0; requestRender(); }, 90);
  }

  new IntersectionObserver(entries => {
    visible = entries.some(entry => entry.isIntersecting);
    if (visible) requestRender();
  }, { rootMargin:'120px' }).observe(scene);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) requestRender(); });
  new ResizeObserver(() => { resize(); requestRender(); }).observe(scene);
  compactQuery.addEventListener('change', () => { resize(true); requestRender(); });
  reduceMotion.addEventListener('change', requestRender);
  new MutationObserver(() => sync()).observe(grid, { childList:true, subtree:true, attributes:true, attributeFilter:['class'] });
  const stage = scene.closest('.calendar-stage');
  if (stage) new MutationObserver(requestRender).observe(stage, { attributes:true, attributeFilter:['class'] });

  scene.prepend(canvas);
  scene.classList.add('is-3d');
  resize(true);
  placeCamera();
  sync();
  requestRender();
  return { renderer };
}
