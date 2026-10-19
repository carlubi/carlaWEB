/** Consistent 24px line icon identifiers for the Advent experience. */
/* In day order (Adviento/indice-contenidos.md): mapa, modelos, pedir, markdown, mini-app, errores,
   proyecto, contexto, conectores, calendario, correo y Drive, plantillas, presentación, investigar,
   informe, tarea programada, clasificar correo, asistente, pack de tareas, navegador, semana, reunión,
   tres zonas, mapa 2027. */
const dayIcons = [
  'task-map', 'sliders-check', 'message-pencil', 'palette', 'mini-app', 'error-search',
  'folder', 'triple-check', 'plug-shield', 'calendar-link', 'document-search', 'briefcase',
  'slides', 'book-search', 'report', 'timer', 'inbox-eye', 'assistant',
  'clock-stack', 'browser', 'calendar-sun', 'meeting-list', 'balance', 'compass'
] as const;

const achievementIcons: Record<string, string> = {
  primera: 'door-open',
  tres: 'triple-check',
  conectada: 'plug-shield',
  critica: 'error-search',
  sola: 'timer',
  mitad: 'halfway',
  datos: 'report',
  vigilante: 'inbox-eye',
  todas: 'trophy'
};

export function dayIcon(day: number): string { return dayIcons[day - 1] ?? 'gift'; }
export function achievementIcon(key: string): string { return achievementIcons[key] ?? 'gift'; }
export function iconHref(name: string): string { return `/assets/adviento-icons.svg#${name}`; }
