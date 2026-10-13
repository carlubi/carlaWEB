/** Consistent 24px line icon identifiers for the Advent experience. */
const dayIcons = [
  'task-map', 'plug-shield', 'calendar-link', 'folder', 'mini-app', 'error-search',
  'timer', 'message-pencil', 'slides', 'document-search', 'meeting-list', 'briefcase',
  'video', 'report', 'palette', 'book-search', 'balance', 'assistant',
  'clock-stack', 'browser', 'calendar-sun', 'inbox-eye', 'sliders-check', 'compass'
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
