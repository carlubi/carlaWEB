-- Lógica de suscripciones, bajas, rebotes y envíos de la newsletter.
-- Todo se ejecuta con la clave de servicio desde las Edge Functions, salvo el registro del calendario
-- (adviento_registrar y adviento_mi_perfil), que llama la propia usuaria con su sesión.

-- 0. Límite de peticiones ---------------------------------------------------------------------
create table if not exists private.limites (
  clave   text primary key,
  ventana timestamptz not null,
  n       int not null
);
alter table private.limites enable row level security;
revoke all on private.limites from public, anon, authenticated;

-- true si la clave no ha superado p_max peticiones en los últimos p_segundos
create or replace function public.permitir_peticion(p_clave text, p_max int, p_segundos int)
returns boolean language plpgsql security definer set search_path = '' as $$
declare v_n int;
begin
  insert into private.limites as l (clave, ventana, n) values (p_clave, now(), 1)
  on conflict (clave) do update set
    n = case when l.ventana < now() - make_interval(secs => p_segundos) then 1 else l.n + 1 end,
    ventana = case when l.ventana < now() - make_interval(secs => p_segundos) then now() else l.ventana end
  returning n into v_n;
  delete from private.limites where ventana < now() - interval '1 day';
  return v_n <= p_max;
end; $$;

-- 1. Alta en una lista ------------------------------------------------------------------------
-- Crea o reutiliza la ficha y la suscripción. Una suscripción dada de baja que se vuelve a pedir se
-- reactiva sin confirmar: así nadie puede reactivar la de otra persona escribiendo su correo.
create or replace function public.suscripcion_alta(
  p_email text, p_nombre text, p_lista text, p_version text, p_origen text, p_confirmado boolean default false)
returns table (suscriptor_id uuid, confirmado boolean)
language plpgsql security definer set search_path = '' as $$
#variable_conflict use_column
declare
  v_email text := lower(trim(p_email));
  v_nombre text := nullif(left(trim(coalesce(p_nombre, '')), 80), '');
  v_id uuid;
begin
  if p_lista not in ('adviento', 'newsletter') then raise exception 'Lista no válida'; end if;
  if v_email !~ '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$' or char_length(v_email) > 254 then raise exception 'Correo no válido'; end if;

  insert into public.suscriptores as s (email, nombre) values (v_email, v_nombre)
  on conflict (email) do update set nombre = coalesce(excluded.nombre, s.nombre)
  returning s.id into v_id;

  insert into public.suscripciones as x (suscriptor_id, lista, consentimiento_en, version_politica, origen, confirmado_en)
  values (v_id, p_lista, now(), p_version, p_origen, case when p_confirmado then now() end)
  on conflict (suscriptor_id, lista) do update set
    consentimiento_en = case when x.baja_at is not null then now() else x.consentimiento_en end,
    version_politica  = case when x.baja_at is not null then excluded.version_politica else x.version_politica end,
    origen            = case when x.baja_at is not null then excluded.origen else x.origen end,
    confirmado_en     = case when x.baja_at is not null then excluded.confirmado_en
                             else coalesce(x.confirmado_en, excluded.confirmado_en) end,
    baja_at           = null;

  return query select v_id, (select x.confirmado_en is not null from public.suscripciones x
                              where x.suscriptor_id = v_id and x.lista = p_lista);
end; $$;

-- 2. Confirmación (doble opt-in) --------------------------------------------------------------
create or replace function public.suscripcion_confirmar(p_suscriptor uuid, p_lista text)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  update public.suscripciones set confirmado_en = coalesce(confirmado_en, now())
  where suscriptor_id = p_suscriptor and lista = p_lista and baja_at is null;
  return found;
end; $$;

-- 3. Bajas por token (lista concreta o 'todo') y deshacer ---------------------------------------
create or replace function public.suscripcion_baja(p_token uuid, p_lista text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare v_id uuid;
begin
  if p_lista not in ('adviento', 'newsletter', 'todo') then return false; end if;
  select id into v_id from public.suscriptores where baja_token = p_token;
  if v_id is null then return false; end if;
  update public.suscripciones set baja_at = now()
  where suscriptor_id = v_id and baja_at is null and (p_lista = 'todo' or lista = p_lista);
  -- columnas antiguas, mientras existan
  if p_lista in ('adviento', 'todo') then
    update public.adviento_perfiles set avisos_email = false where suscriptor_id = v_id;
  end if;
  return true;
end; $$;

create or replace function public.suscripcion_deshacer_baja(p_token uuid, p_lista text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare v_id uuid;
begin
  if p_lista not in ('adviento', 'newsletter', 'todo') then return false; end if;
  select id into v_id from public.suscriptores where baja_token = p_token;
  if v_id is null then return false; end if;
  -- solo deshace bajas recientes: es el «me he equivocado» de la página de baja
  update public.suscripciones set baja_at = null, consentimiento_en = now()
  where suscriptor_id = v_id and baja_at > now() - interval '1 day' and (p_lista = 'todo' or lista = p_lista);
  if p_lista in ('adviento', 'todo') then
    update public.adviento_perfiles p set avisos_email = true
    where p.suscriptor_id = v_id and exists (select 1 from public.suscripciones x
      where x.suscriptor_id = v_id and x.lista = 'adviento' and x.baja_at is null);
  end if;
  return true;
end; $$;

-- Enlaces antiguos: /baja?id=… (newsletter) y /adviento/baja?token=… siguen funcionando.
create or replace function public.darse_de_baja(p_id uuid)
returns void language sql security definer set search_path = '' as $$
  update public.suscriptores set baja_at = coalesce(baja_at, now()) where id = p_id;
  update public.suscripciones set baja_at = now() where suscriptor_id = p_id and lista = 'newsletter' and baja_at is null;
$$;

create or replace function public.adviento_darse_de_baja(p_token uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  update public.adviento_perfiles set avisos_email = false where baja_token = p_token;
  update public.suscripciones x set baja_at = now()
  from public.suscriptores s
  where s.baja_token = p_token and x.suscriptor_id = s.id and x.lista = 'adviento' and x.baja_at is null;
  return exists (select 1 from public.suscriptores where baja_token = p_token)
      or exists (select 1 from public.adviento_perfiles where baja_token = p_token);
end; $$;

-- 4. Rebotes y quejas (webhook de Resend) -----------------------------------------------------
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
  if v_id is null then
    select id into v_id from public.suscriptores where email = lower(trim(p_email));
  end if;
  if v_id is null then return false; end if;
  update public.newsletter_envios set estado = p_tipo where resend_id = p_resend_id;
  update public.suscripciones set baja_at = now() where suscriptor_id = v_id and baja_at is null;
  update public.adviento_perfiles set avisos_email = false where suscriptor_id = v_id;
  return true;
end; $$;

-- 5. Registro del calendario (lo llama la usuaria con su sesión) --------------------------------
-- Su correo ya está verificado por el código de acceso, así que las dos listas nacen confirmadas.
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

  insert into public.adviento_perfiles (user_id, email, nombre, acepto_politicas, version_politica, avisos_email, suscriptor_id)
  values (v_uid, lower(v_email), v_nombre, true, p_version, p_avisos, v_id)
  on conflict on constraint adviento_perfiles_pkey do update
    set suscriptor_id = excluded.suscriptor_id, avisos_email = excluded.avisos_email;

  if p_avisos then perform public.suscripcion_alta(v_email, v_nombre, 'adviento', p_version, 'adviento', true); end if;
  if p_newsletter then perform public.suscripcion_alta(v_email, v_nombre, 'newsletter', p_version, 'adviento', true); end if;

  return query select v_uid, v_nombre, p_avisos;
end; $$;

-- Solo los datos de quien llama: lo que la web necesita para saludar y decidir si pedir registro.
create or replace function public.adviento_mi_perfil()
returns table (user_id uuid, nombre text, avisos_email boolean)
language sql stable security definer set search_path = '' as $$
  select p.user_id, coalesce(s.nombre, ''),
         exists (select 1 from public.suscripciones x where x.suscriptor_id = p.suscriptor_id
                 and x.lista = 'adviento' and x.baja_at is null)
  from public.adviento_perfiles p
  left join public.suscriptores s on s.id = p.suscriptor_id
  where p.user_id = (select auth.uid());
$$;

-- 6. Avisos del adviento: ahora salen de la lista adviento ---------------------------------------
create or replace function public.adviento_pendientes(p_dia smallint)
returns table (user_id uuid, email text, nombre text, baja_token uuid)
language sql stable set search_path = '' as $$
  select p.user_id, s.email, coalesce(s.nombre, ''), s.baja_token
  from public.adviento_perfiles p
  join public.suscriptores s on s.id = p.suscriptor_id
  join public.suscripciones x on x.suscriptor_id = s.id and x.lista = 'adviento'
  left join public.adviento_correos c on c.user_id = p.user_id and c.dia = p_dia
  where x.baja_at is null and x.confirmado_en is not null
    and (c.user_id is null or c.estado = 'fallido'
      or (c.estado = 'pendiente' and c.actualizado_en < now() - interval '30 minutes'))
  order by p.creado_en
  limit 100;
$$;

-- 7. Envío de la newsletter ------------------------------------------------------------------
alter table public.newsletter_envios add column if not exists reclamado_en timestamptz;

-- Devuelve el número en curso (reanudar) o pasa a «enviando» el siguiente aprobado con fecha vencida.
-- Sin programado_para no sale nunca.
create or replace function public.newsletter_siguiente_numero()
returns setof public.newsletter_numeros
language plpgsql security definer set search_path = '' as $$
declare v_id uuid;
begin
  select id into v_id from public.newsletter_numeros where estado = 'enviando' order by programado_para limit 1;
  if v_id is null then
    update public.newsletter_numeros set estado = 'enviando'
    where id = (select id from public.newsletter_numeros
                where estado = 'aprobado' and programado_para is not null and programado_para <= now()
                order by programado_para limit 1 for update skip locked)
    returning id into v_id;
  end if;
  return query select * from public.newsletter_numeros where id = v_id;
end; $$;

-- Reserva un lote de destinatarios: crea las filas que falten y devuelve las que tocan ahora.
-- Quien se dio de baja o rebotó a mitad de envío se marca como omitido y no se le envía.
create or replace function public.newsletter_reservar_lote(p_numero uuid, p_limite int)
returns table (suscriptor_id uuid, email text, nombre text, baja_token uuid)
language plpgsql security definer set search_path = '' as $$
#variable_conflict use_column
begin
  insert into public.newsletter_envios (numero_id, suscriptor_id)
  select p_numero, x.suscriptor_id from public.suscripciones x
  where x.lista = 'newsletter' and x.baja_at is null and x.confirmado_en is not null
  on conflict do nothing;

  update public.newsletter_envios e set estado = 'error', intentos = 3, ultimo_error = 'omitido: ya no está suscrito'
  where e.numero_id = p_numero and e.estado in ('pendiente', 'error') and not exists (
    select 1 from public.suscripciones x where x.suscriptor_id = e.suscriptor_id and x.lista = 'newsletter'
      and x.baja_at is null and x.confirmado_en is not null);

  return query
  with lote as (
    select e.suscriptor_id from public.newsletter_envios e
    where e.numero_id = p_numero and (e.estado = 'pendiente' or (e.estado = 'error' and e.intentos < 3))
      and (e.reclamado_en is null or e.reclamado_en < now() - interval '15 minutes')
    order by e.suscriptor_id limit p_limite
    for update skip locked
  ), marcado as (
    update public.newsletter_envios e set reclamado_en = now(), intentos = e.intentos + 1
    from lote where e.numero_id = p_numero and e.suscriptor_id = lote.suscriptor_id
    returning e.suscriptor_id
  )
  select s.id, s.email, coalesce(s.nombre, ''), s.baja_token
  from marcado m join public.suscriptores s on s.id = m.suscriptor_id;
end; $$;

-- p_resultados: [{"suscriptor_id": "...", "estado": "enviado"|"error", "resend_id": "...", "error": "..."}]
create or replace function public.newsletter_guardar_resultados(p_numero uuid, p_resultados jsonb)
returns void language sql security definer set search_path = '' as $$
  update public.newsletter_envios e set
    estado = r.estado,
    resend_id = coalesce(r.resend_id, e.resend_id),
    ultimo_error = r.error,
    enviado_en = case when r.estado = 'enviado' then now() else e.enviado_en end,
    -- un error se reintenta pasados 15 minutos (newsletter_reservar_lote), no en la misma ejecución
    reclamado_en = case when r.estado = 'enviado' then null else e.reclamado_en end
  from jsonb_to_recordset(p_resultados) as r(suscriptor_id uuid, estado text, resend_id text, error text)
  where e.numero_id = p_numero and e.suscriptor_id = r.suscriptor_id and e.estado in ('pendiente', 'error');
$$;

-- Cierra el número cuando ya no queda nadie por intentar.
create or replace function public.newsletter_cerrar(p_numero uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if exists (select 1 from public.newsletter_envios where numero_id = p_numero
             and (estado = 'pendiente' or (estado = 'error' and intentos < 3))) then
    return false;
  end if;
  update public.newsletter_numeros set estado = 'enviado', enviado_en = now() where id = p_numero and estado = 'enviando';
  return true;
end; $$;

-- 8. El formulario antiguo sigue funcionando hasta desplegar la web nueva -----------------------
create or replace function public.suscribir(p_nombre text, p_email text, p_version text, p_origen text)
returns text language plpgsql security definer set search_path = '' as $$
begin
  perform public.suscripcion_alta(p_email, p_nombre, 'newsletter', p_version, p_origen, false);
  return 'ok';
exception when others then
  return 'ok';
end; $$;

-- 9. Guías: archivos privados en Storage -------------------------------------------------------
insert into storage.buckets (id, name, public) values ('guias', 'guias', false) on conflict (id) do nothing;

-- 10. Permisos: nada de esto se puede llamar desde la web, salvo el registro del calendario ------
revoke execute on function
  public.permitir_peticion(text, int, int),
  public.suscripcion_alta(text, text, text, text, text, boolean),
  public.suscripcion_confirmar(uuid, text),
  public.suscripcion_baja(uuid, text),
  public.suscripcion_deshacer_baja(uuid, text),
  public.correo_incidencia(text, text, text),
  public.adviento_pendientes(smallint),
  public.newsletter_siguiente_numero(),
  public.newsletter_reservar_lote(uuid, int),
  public.newsletter_guardar_resultados(uuid, jsonb),
  public.newsletter_cerrar(uuid),
  public.adviento_registrar(text, boolean, boolean, text),
  public.adviento_mi_perfil()
from public, anon, authenticated;
grant execute on function
  public.permitir_peticion(text, int, int),
  public.suscripcion_alta(text, text, text, text, text, boolean),
  public.suscripcion_confirmar(uuid, text),
  public.suscripcion_baja(uuid, text),
  public.suscripcion_deshacer_baja(uuid, text),
  public.correo_incidencia(text, text, text),
  public.adviento_pendientes(smallint),
  public.newsletter_siguiente_numero(),
  public.newsletter_reservar_lote(uuid, int),
  public.newsletter_guardar_resultados(uuid, jsonb),
  public.newsletter_cerrar(uuid)
to service_role;
grant execute on function public.adviento_registrar(text, boolean, boolean, text), public.adviento_mi_perfil() to authenticated;
