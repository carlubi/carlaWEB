# Suscripciones, newsletter y bajas

## Cómo funciona

- **Una ficha por persona** en `suscriptores` (email único) y **una suscripción por lista** en `suscripciones` (`adviento`, `newsletter`), cada una con su consentimiento, versión de la política, origen, confirmación y baja.
- **Altas**
  - Formulario general y guías → `POST /api/suscribir`. Responde siempre lo mismo, exista o no el correo. Tiene límite de peticiones y un campo trampa para robots.
  - Newsletter: se envía un correo de confirmación y solo se escribe a quien confirma (doble opt-in).
  - Guías: el correo trae un enlace firmado que caduca en 7 días. Al descargar la guía se confirma la suscripción. Los PDF están en un bucket privado de Storage (`guias`); la configuración está en `supabase/functions/_shared/guias.json`.
  - Calendario: `adviento_registrar` crea la ficha y el calendario, y cada lista solo si se marca su casilla (las dos sin marcar por defecto). El correo ya está verificado por el código de acceso, así que nacen confirmadas.
- **Bajas**
  - Cada correo enlaza a `/baja?token=…&lista=…`: botón de un clic, opción de «de todo» y de deshacer. Abrir la página no da de baja.
  - Gmail y Yahoo usan `List-Unsubscribe` + `List-Unsubscribe-Post` contra `POST /api/baja`.
  - Siguen funcionando los enlaces antiguos `/baja?id=…` y `/adviento/baja?token=…`.
- **Rebotes y quejas:** Resend llama a `/api/resend-webhook` (firma comprobada). Un rebote permanente o una queja da de baja de todo.
- **Newsletter semanal**
  - La tarea de Claude guarda cada número en `newsletter_numeros` como `borrador`.
  - Carla lo revisa y lo pasa a `aprobado` con `programado_para`. **Sin fecha no sale nunca.**
  - `pg_cron` llama cada 10 minutos a `enviar-newsletter`, que envía en lotes de 100, sustituye `{{baja_url}}` por el enlace personal y registra cada envío en `newsletter_envios`. Si se corta, continúa sin repetir.
  - La tarea guarda también el texto del prompt en `prompt`. La página `/prompts/<numero>` lo muestra con un botón «Copiar», solo cuando el número ya ha salido.
- **Textos de consentimiento y versión:** `src/data/suscripciones.ts`.

## Aprobar un número (consulta)

```sql
update public.newsletter_numeros
set estado = 'aprobado', programado_para = '2026-11-01 09:00:00+01'
where numero = 1 and estado = 'borrador';
```

Envío de prueba solo a hola@carla-lopez.com:
`curl -X POST https://zqautpepyjivwkzobfha.supabase.co/functions/v1/enviar-newsletter -H "Authorization: Bearer $NEWSLETTER_CRON_SECRET" -d '{"prueba":true,"numero":1}'`

Cifras de un número:

```sql
select estado, count(*) from public.newsletter_envios e
join public.newsletter_numeros n on n.id = e.numero_id where n.numero = 1 group by estado;
```

## Probar en local

1. `supabase start`
2. `supabase functions serve --env-file supabase/functions/.env.local`. Con `RESEND_DRY_RUN=1` no sale ningún correo: se escriben en el registro.
3. `npm run dev`. En local, los formularios llaman directamente a `http://127.0.0.1:54321/functions/v1`.

## Pasar a producción (fase 7, con aprobación de Carla)

1. Copia de seguridad: `suscriptores`, `adviento_perfiles` y `suscripciones` en el esquema `private`.
2. Secretos de las funciones: `supabase secrets set --env-file <archivo con los valores de .env.example>`.
3. En Vault: `newsletter_cron_secret` (el mismo valor que `NEWSLETTER_CRON_SECRET`).
4. Migraciones: `supabase db push` (aplica `suscripciones_listas`, `suscripciones_backend` y `newsletter_cron`). Verificar recuentos.
5. Subir los PDF de `guias/` al bucket `guias`.
6. Desplegar las funciones: `supabase functions deploy suscribir confirmar baja resend-webhook enviar-newsletter adviento-correo`.
7. Desplegar la web en Vercel (incluye `vercel.json` y `public/assets/logo-mark.png`).
8. En Resend: webhook `https://www.carla-lopez.com/api/resend-webhook` con los eventos `email.bounced` y `email.complained`. Comprobar SPF, DKIM y DMARC del dominio.
9. Pruebas con hola@carla-lopez.com: alta, confirmación, guía, baja de un clic y envío de prueba de la newsletter.
10. Cuando todo funcione: `supabase/pendientes/limpieza_columnas_antiguas.sql` → `supabase/migrations/`, `supabase db push`, y `get_advisors`.
