-- Calendario de Adviento 2026. Ejecutar antes de adviento-seed.sql.
-- El correo se verifica con Supabase Auth; la newsletter existente es independiente.
create schema if not exists private;

create table if not exists public.adviento_perfiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  nombre text not null check (char_length(trim(nombre)) between 1 and 80),
  acepto_politicas boolean not null check (acepto_politicas = true),
  version_politica text not null default '2026-10-12',
  fecha_aceptacion timestamptz not null default now(),
  avisos_email boolean not null default false,
  baja_token uuid not null unique default gen_random_uuid(),
  creado_en timestamptz not null default now()
);

create table if not exists public.adviento_dias (
  dia smallint primary key check (dia between 1 and 24),
  titulo text not null,
  tipo text not null,
  herramienta text not null,
  minutos smallint not null,
  datos text not null,
  descripcion text not null,
  simbolo text not null,
  abre_el date not null unique
);

create table if not exists public.adviento_progreso (
  user_id uuid not null references public.adviento_perfiles(user_id) on delete cascade,
  dia smallint not null references public.adviento_dias(dia),
  abierto_en timestamptz not null default now(),
  completado_en timestamptz,
  primary key (user_id, dia)
);

create table if not exists public.adviento_contenido (
  dia smallint primary key references public.adviento_dias(dia) on delete cascade,
  contenido jsonb not null
);

create table if not exists public.adviento_logros (
  user_id uuid not null references public.adviento_perfiles(user_id) on delete cascade,
  logro text not null check (logro in ('primera','tres','conectada','critica','sola','mitad','datos','vigilante','todas')),
  conseguido_en timestamptz not null default now(),
  primary key (user_id, logro)
);

create table if not exists public.adviento_correos (
  user_id uuid not null references public.adviento_perfiles(user_id) on delete cascade,
  dia smallint not null references public.adviento_dias(dia),
  estado text not null default 'pendiente' check (estado in ('pendiente','enviado','fallido')),
  intentos smallint not null default 1,
  actualizado_en timestamptz not null default now(),
  enviado_en timestamptz,
  resend_id text,
  ultimo_error text,
  primary key (user_id, dia)
);

alter table public.adviento_perfiles enable row level security;
alter table public.adviento_dias enable row level security;
alter table public.adviento_progreso enable row level security;
alter table public.adviento_contenido enable row level security;
alter table public.adviento_logros enable row level security;
alter table public.adviento_correos enable row level security;

create or replace function private.adviento_email_verificado()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  new.email := (select email from auth.users where id = new.user_id and id = (select auth.uid()));
  if new.email is null then raise exception 'Necesitas un correo verificado'; end if;
  new.fecha_aceptacion := now();
  return new;
end; $$;
revoke all on function private.adviento_email_verificado() from public;
create trigger adviento_email_verificado before insert on public.adviento_perfiles
  for each row execute function private.adviento_email_verificado();

revoke all on public.adviento_perfiles, public.adviento_dias, public.adviento_progreso,
  public.adviento_contenido, public.adviento_logros, public.adviento_correos from anon, authenticated;
grant select, insert on public.adviento_perfiles to authenticated;
grant select on public.adviento_dias to authenticated;
grant select, insert, update (completado_en) on public.adviento_progreso to authenticated;
grant select on public.adviento_contenido, public.adviento_logros to authenticated;

create policy "perfil propio leer" on public.adviento_perfiles for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "perfil propio crear" on public.adviento_perfiles for insert to authenticated
  with check ((select auth.uid()) = user_id and acepto_politicas = true);
create policy "dias visibles" on public.adviento_dias for select to authenticated using (true);
create policy "progreso propio leer" on public.adviento_progreso for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "progreso propio abrir" on public.adviento_progreso for insert to authenticated
  with check (
    (select auth.uid()) = user_id and completado_en is null and
    exists (select 1 from public.adviento_dias d where d.dia = adviento_progreso.dia
      and d.abre_el <= (now() at time zone 'Europe/Madrid')::date)
  );
create policy "progreso propio completar" on public.adviento_progreso for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "contenido solo tras abrir" on public.adviento_contenido for select to authenticated
  using (exists (
    select 1 from public.adviento_progreso p join public.adviento_dias d on d.dia = p.dia
    where p.user_id = (select auth.uid()) and p.dia = adviento_contenido.dia
      and d.abre_el <= (now() at time zone 'Europe/Madrid')::date
  ));
create policy "logros propios leer" on public.adviento_logros for select to authenticated
  using ((select auth.uid()) = user_id);

create or replace function private.adviento_sellar_progreso()
returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    new.abierto_en := now();
    new.completado_en := null;
  else
    new.abierto_en := old.abierto_en;
    new.completado_en := coalesce(old.completado_en, now());
  end if;
  return new;
end; $$;
create trigger adviento_sellar_progreso before insert or update on public.adviento_progreso
  for each row execute function private.adviento_sellar_progreso();

create or replace function private.adviento_conceder_logros()
returns trigger language plpgsql security definer set search_path = '' as $$
declare v_completados integer;
begin
  if new.dia = 1 then
    insert into public.adviento_logros (user_id, logro) values (new.user_id, 'primera') on conflict do nothing;
  end if;
  if new.completado_en is null or (tg_op = 'UPDATE' and old.completado_en is not null) then return new; end if;
  select count(*) into v_completados from public.adviento_progreso
    where user_id = new.user_id and completado_en is not null;
  if v_completados >= 3 then insert into public.adviento_logros values (new.user_id, 'tres', now()) on conflict do nothing; end if;
  if v_completados >= 12 then insert into public.adviento_logros values (new.user_id, 'mitad', now()) on conflict do nothing; end if;
  if v_completados >= 24 then insert into public.adviento_logros values (new.user_id, 'todas', now()) on conflict do nothing; end if;
  if new.dia = 3 then insert into public.adviento_logros values (new.user_id, 'conectada', now()) on conflict do nothing; end if;
  if new.dia = 6 then insert into public.adviento_logros values (new.user_id, 'critica', now()) on conflict do nothing; end if;
  if new.dia = 7 then insert into public.adviento_logros values (new.user_id, 'sola', now()) on conflict do nothing; end if;
  if new.dia = 14 then insert into public.adviento_logros values (new.user_id, 'datos', now()) on conflict do nothing; end if;
  if new.dia = 22 then insert into public.adviento_logros values (new.user_id, 'vigilante', now()) on conflict do nothing; end if;
  return new;
end; $$;
revoke all on function private.adviento_conceder_logros() from public;
create trigger adviento_conceder_logros after insert or update of completado_en on public.adviento_progreso
  for each row execute function private.adviento_conceder_logros();

create or replace function public.adviento_hoy()
returns date language sql stable security invoker set search_path = '' as $$
  select (now() at time zone 'Europe/Madrid')::date;
$$;
revoke all on function public.adviento_hoy() from public;
grant execute on function public.adviento_hoy() to authenticated;

create or replace function public.adviento_abrir(p_dia smallint)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare v_contenido jsonb;
begin
  if (select auth.uid()) is null or not exists
    (select 1 from public.adviento_perfiles where user_id = (select auth.uid())) then
    raise exception 'Regístrate para abrir una puerta';
  end if;
  if not exists (select 1 from public.adviento_dias where dia = p_dia
      and abre_el <= (now() at time zone 'Europe/Madrid')::date) then
    raise exception 'Esta puerta todavía no está disponible';
  end if;
  insert into public.adviento_progreso (user_id, dia) values ((select auth.uid()), p_dia)
    on conflict do nothing;
  select contenido into v_contenido from public.adviento_contenido where dia = p_dia;
  return v_contenido;
end; $$;
revoke all on function public.adviento_abrir(smallint) from public;
grant execute on function public.adviento_abrir(smallint) to authenticated;

create or replace function public.adviento_completar(p_dia smallint)
returns boolean language plpgsql security invoker set search_path = '' as $$
begin
  update public.adviento_progreso set completado_en = now()
    where user_id = (select auth.uid()) and dia = p_dia and completado_en is null;
  return exists(select 1 from public.adviento_progreso
    where user_id = (select auth.uid()) and dia = p_dia and completado_en is not null);
end; $$;
revoke all on function public.adviento_completar(smallint) from public;
grant execute on function public.adviento_completar(smallint) to authenticated;

create or replace function public.adviento_darse_de_baja(p_token uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  update public.adviento_perfiles set avisos_email = false where baja_token = p_token;
  return found;
end; $$;
revoke all on function public.adviento_darse_de_baja(uuid) from public;
grant execute on function public.adviento_darse_de_baja(uuid) to anon, authenticated;

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
