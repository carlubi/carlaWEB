# Calendario de Adviento IA 2026

La página `/adviento` está implementada en Astro. Muestra el calendario bajo un cristal difuminado hasta que la persona entra con su correo. Cada puerta abierta lleva a `/adviento/dia/N`, una página propia para leer el reto, copiar el prompt, descargar materiales y marcarlo como completado. Los metadatos públicos de los 24 días salen de `Adviento/` mediante `npm run build:adviento`; el contenido completo y las descargas se guardan en Supabase y solo se leen después de abrir cada puerta. Las tablas, los 24 retos, las políticas RLS y la tarea programada ya están aplicadas al proyecto `zqautpepyjivwkzobfha`. La función `adviento-correo` también está desplegada.

## Vista local completa

Ejecuta `npm run build:adviento` y después `npm run dev`; abre `/adviento` en la URL local que muestre Astro. En este modo aparecen las **24 puertas disponibles sin correo**, puedes abrir cualquier día, leer sus pasos y prompts, descargar los materiales y probar la animación de completar. La banda «Vista local» permite reiniciar los avances de prueba. Estos avances viven solo en el almacenamiento local del navegador y no escriben en Supabase.

`adviento-preview.json` se genera desde los archivos de `Adviento/` para esta vista. Astro lo incrusta únicamente durante `astro dev`; la compilación de producción no lo publica. `npm run preview` sirve la compilación de producción con las restricciones reales de Supabase.

## Acceso anticipado en producción

La cuenta verificada `carla@innovalaus.com` tiene acceso anticipado a los 24 días. Debe iniciar sesión normalmente; Supabase identifica a la persona por su `user_id` y devuelve el permiso desde `adviento_estado()`. Las políticas RLS y `adviento_abrir()` aplican la excepción solo a esa cuenta. El permiso se limita al calendario y no concede privilegios de administración sobre Supabase ni sobre los datos de otras personas. Los avances y logros de prueba se guardan en la cuenta real.

La migración `supabase/migrations/20261019210852_adviento_acceso_anticipado_admin.sql` instala el permiso y las políticas. La web debe estar desplegada con la versión que consulta `adviento_estado()` para mostrar las 24 puertas como disponibles.

## Configuración pendiente para el correo

1. En **Supabase → Authentication → URL Configuration**, establece el sitio en `https://carla-lopez.com` e incluye `https://carla-lopez.com/adviento` entre las URL de redirección. Añade también la URL de cualquier entorno de pruebas donde vayas a abrir el enlace de acceso.
2. En **Supabase → Authentication → SMTP Settings**, activa SMTP personalizado con tu cuenta de Resend. Usa el servidor y puerto SMTP que indique tu panel de Resend, el usuario `resend` y tu clave API como contraseña. Configura un remitente del dominio verificado, por ejemplo `hola@carla-lopez.com`. Este paso es necesario para enviar enlaces de acceso a usuarios externos al equipo del proyecto.
3. En **Supabase → Edge Functions → Secrets**, crea `RESEND_API_KEY` con tu clave privada de Resend. Crea también `ADVIENTO_CRON_SECRET` con un valor aleatorio largo. Opcionalmente, crea `ADVIENTO_FROM` con el remitente completo, por ejemplo `Carla <hola@carla-lopez.com>`. No pongas estos valores en el repositorio.
4. En **Supabase → SQL Editor**, guarda el **mismo** secreto de cron en Vault:

   ```sql
   select vault.create_secret('EL_MISMO_VALOR_DE_ADVIENTO_CRON_SECRET', 'adviento_cron_secret');
   ```

   La tarea `adviento-correo-2026` ya está programada. Hasta que existan el secreto de la función, la clave de Resend y el valor de Vault, no enviará avisos. Para comprobar el secreto de Vault sin mostrarlo, consulta `select name from vault.decrypted_secrets where name = 'adviento_cron_secret';`.

5. Despliega esta versión de la web y comprueba con un correo propio el enlace de acceso, el registro, la persistencia de sesión y la baja de avisos. La cuenta con acceso anticipado puede probar las aperturas antes del **1 de diciembre de 2026**; para las demás personas la fecha se valida en PostgreSQL.

Los avisos se envían entre las 08:00 y las 09:59 de Madrid del 1 al 24 de diciembre de 2026, en lotes de hasta 100 personas cada cinco minutos. Cada envío lleva enlace de baja y una clave de idempotencia por persona y día. La casilla de avisos es opcional y empieza desmarcada.

## Edición de los retos

Edita los archivos dentro de `Adviento/`, ejecuta `npm run build:adviento`, revisa `src/data/adviento-meta.json` y `supabase/adviento-seed.sql`, y aplica este último SQL en Supabase. El script genera ambos archivos; no edites el JSON o el SQL a mano. Antes de diciembre conviene revisar los pasos que mencionan funciones de herramientas externas, ya que pueden cambiar.

El día 24 incluye un cierre y una invitación general al curso. Cuando esté decidido el nombre, el enlace y la oferta, actualiza ese texto en el generador antes de anunciarlo.

## Estructura

- `src/pages/adviento.astro`, `src/styles/adviento.css`, `src/scripts/adviento.ts`: portada, acceso y calendario.
- `src/pages/adviento/dia/[dia].astro`, `src/styles/adviento-day.css`, `src/scripts/adviento-day.ts`: página individual de cada reto.
- `src/scripts/adviento-api.ts`: sesión y llamadas a Supabase compartidas entre ambas páginas.
- `src/pages/adviento/baja.astro`: baja de avisos.
- `supabase/adviento-schema.sql`: instalación completa para un proyecto nuevo.
- `supabase/adviento-email-upgrade.sql`: ampliación de envíos aplicada sobre el esquema inicial en este proyecto.
- `supabase/adviento-cron.sql`: programación aplicada en este proyecto.
- `supabase/functions/adviento-correo/index.ts`: función programada para avisos.

No vuelvas a ejecutar `adviento-schema.sql` en este proyecto: incluye políticas y disparadores que ya existen. Para modificar el esquema, crea una migración incremental.
