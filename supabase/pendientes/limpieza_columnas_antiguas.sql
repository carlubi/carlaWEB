-- LIMPIEZA FINAL · NO APLICAR HASTA que la web y las funciones nuevas estén desplegadas y probadas en producción.
-- Para aplicarla: copiar este archivo a supabase/migrations/<fecha>_limpieza_columnas_antiguas.sql.
-- Quita las columnas duplicadas: los datos de la persona viven en suscriptores y el consentimiento en suscripciones.

-- 1. adviento_perfiles: solo el enlace con la cuenta y con la ficha --------------------------------
drop trigger if exists adviento_email_verificado on public.adviento_perfiles;
drop function if exists private.adviento_email_verificado();
-- el alta del calendario ya solo se hace con adviento_registrar
drop policy if exists "perfil propio crear" on public.adviento_perfiles;
revoke insert on public.adviento_perfiles from authenticated;

-- 2. Funciones que tocaban las columnas antiguas -------------------------------------------------
create or replace function public.suscripcion_baja(p_token uuid, p_lista text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare v_id uuid;
begin
  if p_lista not in ('adviento', 'newsletter', 'todo') then return false; end if;
  select id into v_id from public.suscriptores where baja_token = p_token;
  if v_id is null then return false; end if;
  update public.suscripciones set baja_at = now()
  where suscriptor_id = v_id and baja_at is null and (p_lista = 'todo' or lista = p_lista);
  return true;
end; $$;

create or replace function public.suscripcion_deshacer_baja(p_token uuid, p_lista text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare v_id uuid;
begin
  if p_lista not in ('adviento', 'newsletter', 'todo') then return false; end if;
  select id into v_id from public.suscriptores where baja_token = p_token;
  if v_id is null then return false; end if;
  update public.suscripciones set baja_at = null, consentimiento_en = now()
  where suscriptor_id = v_id and baja_at > now() - interval '1 day' and (p_lista = 'todo' or lista = p_lista);
  return true;
end; $$;

-- enlaces antiguos /adviento/baja?token=…: el token se copió a suscriptores.baja_token
create or replace function public.adviento_darse_de_baja(p_token uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  update public.suscripciones x set baja_at = now()
  from public.suscriptores s
  where s.baja_token = p_token and x.suscriptor_id = s.id and x.lista = 'adviento' and x.baja_at is null;
  return exists (select 1 from public.suscriptores where baja_token = p_token);
end; $$;

-- enlaces antiguos /baja?id=…
create or replace function public.darse_de_baja(p_id uuid)
returns void language sql security definer set search_path = '' as $$
  update public.suscripciones set baja_at = now() where suscriptor_id = p_id and lista = 'newsletter' and baja_at is null;
$$;

create or replace function public.correo_incidencia(p_resend_id text, p_email text, p_tipo text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare v_id uuid;
begin
  if p_tipo not in ('rebotado', 'queja') then return false; end if;
  select e.suscriptor_id into v_id from public.newsletter_envios e where e.resend_id = p_resend_id;
  if v_id is null then
    select p.suscriptor_id into v_id from public.adviento_correos c
      join public.adviento_perfiles p on p.user_id = c.user_id where c.resend_id = p_resend_id;
  end if;
  if v_id is null then select id into v_id from public.suscriptores where email = lower(trim(p_email)); end if;
  if v_id is null then return false; end if;
  update public.newsletter_envios set estado = p_tipo where resend_id = p_resend_id;
  update public.suscripciones set baja_at = now() where suscriptor_id = v_id and baja_at is null;
  return true;
end; $$;

create or replace function public.adviento_registrar(p_nombre text, p_avisos boolean, p_newsletter boolean, p_version text)
returns table (user_id uuid, nombre text, avisos_email boolean)
language plpgsql security definer set search_path = '' as $$
#variable_conflict use_column
declare
  v_uid uuid := (select auth.uid());
  v_email text;
  v_nombre text := left(trim(coalesce(p_nombre, '')), 80);
  v_id uuid;
begin
  select u.email into v_email from auth.users u where u.id = v_uid and u.email_confirmed_at is not null;
  if v_email is null then raise exception 'Necesitas un correo verificado'; end if;
  if char_length(v_nombre) < 1 then raise exception 'Escribe tu nombre'; end if;

  insert into public.suscriptores as s (email, nombre, user_id) values (lower(v_email), v_nombre, v_uid)
  on conflict (email) do update set nombre = excluded.nombre, user_id = coalesce(s.user_id, excluded.user_id)
  returning s.id into v_id;

  insert into public.adviento_perfiles (user_id, suscriptor_id) values (v_uid, v_id)
  on conflict on constraint adviento_perfiles_pkey do update set suscriptor_id = excluded.suscriptor_id;

  if p_avisos then perform public.suscripcion_alta(v_email, v_nombre, 'adviento', p_version, 'adviento', true); end if;
  if p_newsletter then perform public.suscripcion_alta(v_email, v_nombre, 'newsletter', p_version, 'adviento', true); end if;

  return query select v_uid, v_nombre, p_avisos;
end; $$;

-- el formulario antiguo ya no existe en la web
drop function if exists public.suscribir(text, text, text, text);

-- 3. Columnas antiguas --------------------------------------------------------------------------
alter table public.adviento_perfiles
  drop column if exists email, drop column if exists nombre, drop column if exists acepto_politicas,
  drop column if exists version_politica, drop column if exists fecha_aceptacion,
  drop column if exists avisos_email, drop column if exists baja_token;
alter table public.adviento_perfiles alter column suscriptor_id set not null;

alter table public.suscriptores
  drop column if exists consentimiento, drop column if exists version_politica,
  drop column if exists origen, drop column if exists baja_at;
