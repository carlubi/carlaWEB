-- Ejecutado después de adviento_2026_schema para activar el registro idempotente de correos.
alter table public.adviento_correos
  alter column enviado_en drop not null,
  alter column enviado_en drop default,
  add column estado text not null default 'pendiente' check (estado in ('pendiente','enviado','fallido')),
  add column intentos smallint not null default 1,
  add column actualizado_en timestamptz not null default now(),
  add column resend_id text,
  add column ultimo_error text;

create or replace function public.adviento_pendientes(p_dia smallint)
returns table (user_id uuid, email text, nombre text, baja_token uuid)
language sql stable security invoker set search_path = '' as $$
  select p.user_id, p.email, p.nombre, p.baja_token
  from public.adviento_perfiles p
  left join public.adviento_correos c on c.user_id = p.user_id and c.dia = p_dia
  where p.avisos_email and (c.user_id is null or c.estado = 'fallido'
    or (c.estado = 'pendiente' and c.actualizado_en < now() - interval '30 minutes'))
  order by p.creado_en
  limit 100;
$$;
revoke all on function public.adviento_pendientes(smallint) from public;
grant execute on function public.adviento_pendientes(smallint) to service_role;

create or replace function public.adviento_reservar_correo(p_user_id uuid, p_dia smallint)
returns boolean language plpgsql security invoker set search_path = '' as $$
begin
  insert into public.adviento_correos (user_id,dia) values (p_user_id,p_dia)
  on conflict (user_id,dia) do update set estado='pendiente',
    intentos=public.adviento_correos.intentos+1, actualizado_en=now(), ultimo_error=null
  where public.adviento_correos.estado='fallido'
    or (public.adviento_correos.estado='pendiente' and public.adviento_correos.actualizado_en < now() - interval '30 minutes');
  return found;
end; $$;
revoke all on function public.adviento_reservar_correo(uuid,smallint) from public;
grant execute on function public.adviento_reservar_correo(uuid,smallint) to service_role;
;
