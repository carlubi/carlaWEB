-- Lista de suscriptores de la landing de carlaylz.
-- Ejecutar una vez en Supabase → SQL Editor.

create table if not exists public.suscriptores (
  id               uuid primary key default gen_random_uuid(),
  nombre           text not null check (char_length(nombre) between 1 and 80),
  email            text not null unique
                     check (char_length(email) <= 254 and email = lower(email) and email ~ '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$'),
  consentimiento   boolean not null check (consentimiento = true),
  version_politica text not null check (char_length(version_politica) <= 20),
  origen           text check (char_length(origen) <= 50),
  created_at       timestamptz not null default now(),
  baja_at          timestamptz
);

-- Seguridad: la web (rol anon) solo puede AÑADIR filas.
-- No puede leer, modificar ni borrar la lista.
alter table public.suscriptores enable row level security;

revoke all on public.suscriptores from anon, authenticated;

-- Alta: la web llama a esta función, que devuelve "nuevo", "existente" o
-- "reactivado" (si la persona estaba de baja y vuelve a apuntarse).
-- Así la web no necesita permiso de lectura ni de escritura sobre la tabla.
create or replace function public.suscribir(p_nombre text, p_email text, p_version text, p_origen text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_existe boolean;
  v_baja   timestamptz;
begin
  p_email  := lower(trim(p_email));
  p_nombre := trim(p_nombre);

  select true, baja_at into v_existe, v_baja
    from public.suscriptores where email = p_email;

  if found then
    if v_baja is not null then
      update public.suscriptores
         set baja_at = null, nombre = p_nombre, consentimiento = true, version_politica = p_version
       where email = p_email;
      return 'reactivado';
    end if;
    return 'existente';
  end if;

  insert into public.suscriptores (nombre, email, consentimiento, version_politica, origen)
  values (p_nombre, p_email, true, p_version, p_origen);
  return 'nuevo';
exception when unique_violation then
  return 'existente';
end;
$$;

revoke all on function public.suscribir(text, text, text, text) from public;
grant execute on function public.suscribir(text, text, text, text) to anon;

-- Baja: la página baja.html llama a esta función con el "id" del suscriptor
-- (que irá en el enlace de cada correo). La función solo marca baja_at; la
-- web no recibe permiso de lectura sobre la tabla, así que nadie puede
-- listar los ids ni reactivar una baja.
drop policy if exists "baja mediante enlace" on public.suscriptores;
revoke update (baja_at) on public.suscriptores from anon;

create or replace function public.darse_de_baja(p_id uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.suscriptores
     set baja_at = coalesce(baja_at, now())
   where id = p_id;
$$;

revoke all on function public.darse_de_baja(uuid) from public;
grant execute on function public.darse_de_baja(uuid) to anon;
