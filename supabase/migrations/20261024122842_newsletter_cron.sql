-- Cada 10 minutos, enviar-newsletter mira si hay un número aprobado con fecha vencida y lo envía
-- (o continúa uno a medias). Sin número pendiente, la función no hace nada.
-- Antes de activarlo: crear en Vault el secreto «newsletter_cron_secret» con el mismo valor que
-- NEWSLETTER_CRON_SECRET de la función. Sin ese secreto (por ejemplo, en la base local) no se llama a nada.
select cron.unschedule('newsletter-envio') where exists (select 1 from cron.job where jobname = 'newsletter-envio');
select cron.schedule(
  'newsletter-envio',
  '*/10 * * * *',
  $$
  select net.http_post(
    url := 'https://zqautpepyjivwkzobfha.supabase.co/functions/v1/enviar-newsletter',
    headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || s.decrypted_secret),
    body := '{}'::jsonb,
    timeout_milliseconds := 150000
  )
  from vault.decrypted_secrets s
  where s.name = 'newsletter_cron_secret';
  $$
);
