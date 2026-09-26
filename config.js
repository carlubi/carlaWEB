// Configuración pública de Supabase.
// La clave "publishable" (o "anon") es pública por diseño: la seguridad la da
// la política RLS de supabase/schema.sql, que solo permite insertar.
// NUNCA pongas aquí la clave "secret" / "service_role".
window.CONFIG = {
  SUPABASE_URL: "https://zqautpepyjivwkzobfha.supabase.co",
  SUPABASE_KEY: "sb_publishable_Ly0aaOm_Ef50mPeui_ke4w_0Y5sxcv7",
  VERSION_POLITICA: "2026-09-26"
};
