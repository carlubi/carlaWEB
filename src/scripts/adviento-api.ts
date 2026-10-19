export type AdventSession = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: { id: string; email: string };
};

export type AdventPromptBlock = { tipo:'texto'; html:string } | { tipo:'prompt'; html:string; texto:string; adjuntos?:string[] };
export type AdventDownload = { titulo:string; descripcion:string; nombre:string; formato:'PDF'|'CSV'|'MD'; url:string; peso:string; copiar?:string };
/* Generado por scripts/build-adviento.mjs a partir de Adviento/dia-NN-…/web.md. El HTML sale de nuestro propio Markdown. */
export type AdventContent = {
  secciones: { titulo:string; html:string }[];
  prompts: { titulo:string; bloques:AdventPromptBlock[] }[];
  descargas: AdventDownload[];
};

const base = 'https://zqautpepyjivwkzobfha.supabase.co';
const publishableKey = 'sb_publishable_Ly0aaOm_Ef50mPeui_ke4w_0Y5sxcv7';
const storageKey = 'carlaylz_adviento_session';
let refreshing: Promise<AdventSession> | null = null;

export function savedSession(): AdventSession | null {
  try { return JSON.parse(localStorage.getItem(storageKey) || 'null'); }
  catch { localStorage.removeItem(storageKey); return null; }
}

export function saveSession(data: any): AdventSession {
  const prior = savedSession();
  const session: AdventSession = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + (Number(data.expires_in) || 3600),
    user: data.user || prior?.user || { id: '', email: '' }
  };
  localStorage.setItem(storageKey, JSON.stringify(session));
  return session;
}

export async function auth(path: string, body: Record<string, unknown>, token?: string) {
  const response = await fetch(`${base}/auth/v1/${path}`, {
    method: 'POST',
    headers: { apikey: publishableKey, 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.msg || data.error_description || data.message || `Error ${response.status}`);
  return data;
}

export async function currentSession(): Promise<AdventSession | null> {
  let session = savedSession();
  if (!session?.refresh_token) return null;
  if (session.expires_at < Math.floor(Date.now() / 1000) + 60) {
    if (!refreshing) refreshing = auth('token?grant_type=refresh_token', { refresh_token: session.refresh_token }).then(saveSession).finally(() => { refreshing = null; });
    session = await refreshing;
  }
  return session;
}

export async function verifiedSession(): Promise<AdventSession | null> {
  const session = await currentSession();
  if (!session) return null;
  const response = await fetch(`${base}/auth/v1/user`, { headers: { apikey: publishableKey, Authorization: `Bearer ${session.access_token}` } });
  if (!response.ok) throw new Error('No hemos podido recuperar tu sesión. Entra de nuevo con tu correo.');
  session.user = await response.json();
  localStorage.setItem(storageKey, JSON.stringify(session));
  return session;
}

export async function db<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
  const session = await currentSession();
  if (!session) throw new Error('Tu sesión ha terminado. Vuelve a entrar con tu correo.');
  const response = await fetch(`${base}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(method === 'POST' && path.startsWith('adviento_perfiles') ? { Prefer: 'return=representation' } : {}),
      ...(method === 'POST' && path.startsWith('adviento_logros') ? { Prefer: 'resolution=ignore-duplicates' } : {})
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const raw = await response.text();
  const data = raw ? JSON.parse(raw) : null;
  if (!response.ok) throw new Error(data?.message || `Error ${response.status}`);
  return data as T;
}

export async function subscribeNewsletter(name: string, email: string) {
  const response = await fetch(`${base}/rest/v1/rpc/suscribir`, {
    method: 'POST',
    headers: { apikey: publishableKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_nombre: name, p_email: email, p_version: '2026-10-12', p_origen: 'adviento' })
  });
  if (!response.ok) throw new Error('No se ha guardado la suscripción a la newsletter.');
}

export async function signOut() {
  const token = savedSession()?.access_token;
  localStorage.removeItem(storageKey);
  if (token) await fetch(`${base}/auth/v1/logout`, { method: 'POST', headers: { apikey: publishableKey, Authorization: `Bearer ${token}` } }).catch(() => {});
}
