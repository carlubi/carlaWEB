// Configuración pública de Supabase.
// La clave "publishable" (o "anon") es pública por diseño: la seguridad la da
// la política RLS de supabase/schema.sql, que solo permite insertar.
// NUNCA pongas aquí la clave "secret" / "service_role".
window.CONFIG = {
  SUPABASE_URL: "https://zqautpepyjivwkzobfha.supabase.co",
  SUPABASE_KEY: "PEGA_AQUI_TU_PUBLISHABLE_KEY",
  VERSION_POLITICA: "2026-09-26"
};
