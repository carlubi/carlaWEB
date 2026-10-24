/*
 * Textos de consentimiento y su versión. Carla los revisa con quien corresponda antes de publicarlos.
 * Si cambia un texto o la política de privacidad, sube VERSION_POLITICA: cada alta guarda la versión que aceptó.
 */
export const VERSION_POLITICA = '2026-10-24';

/* {privacidad} y {terminos} se sustituyen por enlaces a esas páginas */
export const CONSENTIMIENTO_NEWSLETTER = 'Quiero recibir la newsletter semanal de Carla. Puedo darme de baja cuando quiera. He leído la {privacidad} y los {terminos}.';
export const CONSENTIMIENTO_GUIA = 'Quiero recibir la guía y la newsletter semanal de Carla. Puedo darme de baja cuando quiera. He leído la {privacidad} y los {terminos}.';
export const CASILLA_AVISOS_ADVIENTO = 'Quiero recibir por correo el aviso de cada día del calendario.';
export const CASILLA_NEWSLETTER_ADVIENTO = 'Quiero recibir también la newsletter semanal.';

/* En producción, Vercel reenvía /api/* a las Edge Functions de Supabase (vercel.json). En local, directo a Supabase. */
export const API_BASE = import.meta.env.DEV ? 'http://127.0.0.1:54321/functions/v1' : '/api';
