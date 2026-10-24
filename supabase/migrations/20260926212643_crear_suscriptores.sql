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

grant update (baja_at) on public.suscriptores to anon;

drop policy if exists "baja mediante enlace" on public.suscriptores;
create policy "baja mediante enlace"
  on public.suscriptores
  for update
  to anon
  using (true)
  with check (baja_at is not null);;
