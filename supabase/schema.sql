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
grant insert (nombre, email, consentimiento, version_politica, origen)
  on public.suscriptores to anon;

drop policy if exists "alta desde la landing" on public.suscriptores;
create policy "alta desde la landing"
  on public.suscriptores
  for insert
  to anon
  with check (consentimiento = true and baja_at is null);

-- Baja: la página baja.html envía el "id" del suscriptor (va en el enlace
-- de cada correo) y solo puede tocar la columna baja_at. No puede leer la
-- tabla, así que no puede listar ni adivinar quién más está suscrito, y no
-- puede reactivar una baja poniendo baja_at de nuevo a null.
grant update (baja_at) on public.suscriptores to anon;

drop policy if exists "baja mediante enlace" on public.suscriptores;
create policy "baja mediante enlace"
  on public.suscriptores
  for update
  to anon
  using (true)
  with check (baja_at is not null);
