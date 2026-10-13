-- Ejecutado en el proyecto Supabase. pg_cron usa UTC; diciembre en Madrid = UTC+1.
-- Antes del 1 de diciembre, crear en Vault un secreto llamado adviento_cron_secret
-- con el mismo valor que ADVIENTO_CRON_SECRET de la Edge Function.
create schema if not exists extensions;
create schema if not exists vault;
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;
create extension if not exists supabase_vault with schema vault;

select cron.schedule(
  'adviento-correo-2026',
  '*/5 7-8 1-24 12 *',
  $$
  select net.http_post(
    url := 'https://zqautpepyjivwkzobfha.supabase.co/functions/v1/adviento-correo',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || coalesce((select decrypted_secret from vault.decrypted_secrets where name = 'adviento_cron_secret'), '')
    ),
    body := '{}'::jsonb
  );
  $$
);
