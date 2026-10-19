/*
 * Colour of each drawer front, shared by the 3D house (adviento-house3d.ts), the CSS fallback
 * (adviento.astro and adviento.ts, through tone-* classes) and DESIGN.md · Calendario de Adviento.
 * Landmark days keep their look when they can be opened; the rest follow diagonal ribbons.
 */
export const SNOW_DAYS = [4, 9, 17, 19, 22];
export type Tone = 'cane'|'halfway'|'eve'|'snow'|'pine'|'0'|'1'|'2';

export function doorTone(dia:number, tipo:string, index:number, cols = 6):Tone {
  if (dia === 1) return 'cane';
  if (dia === 15) return 'halfway';
  if (dia === 24) return 'eve';
  if (SNOW_DAYS.includes(dia)) return 'snow';
  if (tipo === 'Sorpresa') return 'pine';
  const r = Math.floor(index / cols), c = index % cols;
  return String(((c - r) % 3 + 3) % 3) as Tone;
}
export const keepsLook = (dia:number) => dia === 1 || dia === 15 || dia === 24 || SNOW_DAYS.includes(dia);
export const isGift = (tipo:string) => tipo === 'Regalo';
export const doorClass = (dia:number, tipo:string, index:number) => `calendar-door tone-${doorTone(dia, tipo, index)}${isGift(tipo) && !SNOW_DAYS.includes(dia) ? ' is-gift' : ''}`;
