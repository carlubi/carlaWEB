export type PreviewProgress = { dia:number; abierto_en:string; completado_en:string|null };
const key = 'carlaylz_adviento_preview_2026';

export function readPreview(): PreviewProgress[] {
  try {
    const rows = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(rows) ? rows.filter(row => Number.isInteger(row?.dia) && row.dia >= 1 && row.dia <= 24) : [];
  } catch { return []; }
}

function save(rows: PreviewProgress[]) { localStorage.setItem(key,JSON.stringify(rows)); return rows; }
export function openPreview(day:number): PreviewProgress[] {
  const rows = readPreview();
  if (!rows.some(row => row.dia === day)) rows.push({dia:day,abierto_en:new Date().toISOString(),completado_en:null});
  return save(rows);
}
export function completePreview(day:number): PreviewProgress[] {
  const rows = openPreview(day);
  const item = rows.find(row => row.dia === day)!;
  item.completado_en ||= new Date().toISOString();
  return save(rows);
}
export function resetPreview() { localStorage.removeItem(key); }
export function previewAchievements(rows:PreviewProgress[]):Set<string> {
  const done = rows.filter(row => row.completado_en);
  const earned = new Set<string>();
  if (rows.some(row => row.dia === 1)) earned.add('primera');
  if (done.length >= 3) earned.add('tres');
  if (done.length >= 12) earned.add('mitad');
  if (done.length >= 24) earned.add('todas');
  for (const [day,key] of [[3,'conectada'],[6,'critica'],[7,'sola'],[14,'datos'],[22,'vigilante']] as const)
    if (done.some(row => row.dia === day)) earned.add(key);
  return earned;
}
