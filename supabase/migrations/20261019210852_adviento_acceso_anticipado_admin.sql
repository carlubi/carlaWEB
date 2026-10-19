-- Acceso anticipado limitado al calendario para una cuenta de Auth verificada.
-- La identidad se fija por user_id para que cambiar el correo no transfiera el permiso.
create table if not exists private.adviento_administradores (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table private.adviento_administradores enable row level security;
revoke all on private.adviento_administradores from public, anon, authenticated;

do $$
begin
  if (select count(*) from auth.users where lower(email) = 'carla@innovalaus.com' and email_confirmed_at is not null) <> 1 then
    raise exception 'No se encuentra una única cuenta verificada para el acceso anticipado';
  end if;
  if not exists (
    select 1 from auth.users u join public.adviento_perfiles p on p.user_id = u.id
    where lower(u.email) = 'carla@innovalaus.com'
  ) then
    raise exception 'La cuenta autorizada aún no tiene perfil del calendario';
  end if;
  insert into private.adviento_administradores (user_id)
    select id from auth.users where lower(email) = 'carla@innovalaus.com'
    on conflict do nothing;
end $$;

create or replace function private.adviento_es_administrador()
returns boolean language sql stable security definer set search_path = '' as $$
  select (select auth.uid()) is not null and exists (
    select 1 from private.adviento_administradores
    where user_id = (select auth.uid())
  );
$$;
revoke all on function private.adviento_es_administrador() from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.adviento_es_administrador() to authenticated;

create or replace function public.adviento_estado()
returns jsonb language sql stable security invoker set search_path = '' as $$
  select jsonb_build_object(
    'hoy', (now() at time zone 'Europe/Madrid')::date,
    'vista_anticipada', (select private.adviento_es_administrador())
  );
$$;
revoke all on function public.adviento_estado() from public, anon;
grant execute on function public.adviento_estado() to authenticated;

drop policy "progreso propio abrir" on public.adviento_progreso;
create policy "progreso propio abrir" on public.adviento_progreso for insert to authenticated
  with check (
    (select auth.uid()) = user_id and completado_en is null and
    exists (select 1 from public.adviento_dias d where d.dia = adviento_progreso.dia
      and (d.abre_el <= (now() at time zone 'Europe/Madrid')::date
        or (select private.adviento_es_administrador())))
  );

drop policy "contenido solo tras abrir" on public.adviento_contenido;
create policy "contenido solo tras abrir" on public.adviento_contenido for select to authenticated
  using (exists (
    select 1 from public.adviento_progreso p join public.adviento_dias d on d.dia = p.dia
    where p.user_id = (select auth.uid()) and p.dia = adviento_contenido.dia
      and (d.abre_el <= (now() at time zone 'Europe/Madrid')::date
        or (select private.adviento_es_administrador()))
  ));

create or replace function public.adviento_abrir(p_dia smallint)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare v_contenido jsonb;
begin
  if (select auth.uid()) is null or not exists
    (select 1 from public.adviento_perfiles where user_id = (select auth.uid())) then
    raise exception 'Regístrate para abrir una puerta';
  end if;
  if not exists (select 1 from public.adviento_dias where dia = p_dia
      and (abre_el <= (now() at time zone 'Europe/Madrid')::date
        or (select private.adviento_es_administrador()))) then
    raise exception 'Esta puerta todavía no está disponible';
  end if;
  insert into public.adviento_progreso (user_id, dia) values ((select auth.uid()), p_dia)
    on conflict do nothing;
  select contenido into v_contenido from public.adviento_contenido where dia = p_dia;
  return v_contenido;
end; $$;
