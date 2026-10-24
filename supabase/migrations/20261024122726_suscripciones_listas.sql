-- Una ficha por persona (suscriptores) y una suscripción por lista (adviento, newsletter).
-- Idempotente: se puede ejecutar dos veces sin duplicar nada.
-- Las columnas antiguas se conservan hasta que el código nuevo esté desplegado (migración de limpieza aparte).

-- 1. Estructura -----------------------------------------------------------------------------

-- suscriptores: ficha única. Las columnas de consentimiento pasan a suscripciones, así que dejan
-- de ser obligatorias (una persona solo del adviento no ha dado consentimiento a la newsletter).
alter table public.suscriptores
  add column if not exists user_id uuid references auth.users(id) on delete set null,
  add column if not exists baja_token uuid not null default gen_random_uuid();
alter table public.suscriptores alter column nombre drop not null;
alter table public.suscriptores alter column consentimiento drop not null;
alter table public.suscriptores alter column version_politica drop not null;
create unique index if not exists suscriptores_email_lower_key on public.suscriptores (lower(email));
create unique index if not exists suscriptores_baja_token_key on public.suscriptores (baja_token);
create unique index if not exists suscriptores_user_id_key on public.suscriptores (user_id) where user_id is not null;

create table if not exists public.suscripciones (
  suscriptor_id     uuid not null references public.suscriptores(id) on delete cascade,
  lista             text not null check (lista in ('adviento','newsletter')),
  consentimiento_en timestamptz not null,
  version_politica  text not null,
  origen            text,
  confirmado_en     timestamptz,
  baja_at           timestamptz,
  created_at        timestamptz not null default now(),
  primary key (suscriptor_id, lista)
);
create index if not exists suscripciones_activas_idx on public.suscripciones (lista) where baja_at is null;

alter table public.adviento_perfiles
  add column if not exists suscriptor_id uuid references public.suscriptores(id);
create unique index if not exists adviento_perfiles_suscriptor_id_key on public.adviento_perfiles (suscriptor_id);

create table if not exists public.newsletter_numeros (
  id               uuid primary key default gen_random_uuid(),
  numero           int  not null unique,
  asunto           text not null,
  html             text not null,
  texto            text not null,
  estado           text not null default 'borrador'
                   check (estado in ('borrador','aprobado','enviando','enviado')),
  programado_para  timestamptz,
  enviado_en       timestamptz,
  created_at       timestamptz not null default now()
);

create table if not exists public.newsletter_envios (
  numero_id      uuid not null references public.newsletter_numeros(id) on delete cascade,
  suscriptor_id  uuid not null references public.suscriptores(id) on delete cascade,
  estado         text not null default 'pendiente'
                 check (estado in ('pendiente','enviado','error','rebotado','queja')),
  intentos       int2 not null default 0,
  resend_id      text,
  ultimo_error   text,
  enviado_en     timestamptz,
  primary key (numero_id, suscriptor_id)
);
create index if not exists newsletter_envios_suscriptor_idx on public.newsletter_envios (suscriptor_id);

-- Sin acceso desde la web: altas, bajas y envíos pasan por funciones del servidor con la clave de servicio.
alter table public.suscriptores enable row level security;
alter table public.suscripciones enable row level security;
alter table public.newsletter_numeros enable row level security;
alter table public.newsletter_envios enable row level security;
revoke all on public.suscripciones, public.newsletter_numeros, public.newsletter_envios from public, anon, authenticated;
grant select, insert, update, delete on public.suscripciones, public.newsletter_numeros, public.newsletter_envios to service_role;

-- 2. Unificar por email: cada persona del adviento tiene su ficha en suscriptores --------------

insert into public.suscriptores (email, nombre, user_id, created_at)
select lower(trim(p.email)), p.nombre, p.user_id, p.creado_en
from public.adviento_perfiles p
where not exists (select 1 from public.suscriptores s where lower(s.email) = lower(trim(p.email)))
on conflict do nothing;

-- enlazar la cuenta de Auth (solo emails verificados)
update public.suscriptores s set user_id = u.id
from auth.users u
where s.user_id is null and u.email_confirmed_at is not null and lower(trim(u.email)) = lower(s.email)
  and not exists (select 1 from public.suscriptores o where o.user_id = u.id);

-- si el nombre no coincide, se queda el más reciente
update public.suscriptores s set nombre = p.nombre
from public.adviento_perfiles p
where lower(trim(p.email)) = lower(s.email) and p.creado_en > s.created_at
  and s.nombre is distinct from p.nombre;

update public.adviento_perfiles p set suscriptor_id = s.id
from public.suscriptores s
where p.suscriptor_id is null and lower(s.email) = lower(trim(p.email));

-- 3. Suscripciones a partir de lo que ya existe ------------------------------------------------

-- newsletter: quien dio consentimiento en un formulario de newsletter. Se excluye origen 'adviento':
-- su casilla («el aviso de cada día y otras ideas de IA») era ambigua y no cuenta como consentimiento.
-- Ya existían antes del doble opt-in, así que se dan por confirmados.
insert into public.suscripciones (suscriptor_id, lista, consentimiento_en, version_politica, origen, confirmado_en, baja_at, created_at)
select s.id, 'newsletter', s.created_at, s.version_politica, s.origen, s.created_at, s.baja_at, s.created_at
from public.suscriptores s
where s.consentimiento is true and s.version_politica is not null and coalesce(s.origen, '') <> 'adviento'
on conflict (suscriptor_id, lista) do nothing;

-- adviento: quien creó su calendario. Sin la casilla de avisos marcada, la suscripción nace dada de baja.
-- La cuenta de Auth verificada hace de confirmación del email.
insert into public.suscripciones (suscriptor_id, lista, consentimiento_en, version_politica, origen, confirmado_en, baja_at, created_at)
select p.suscriptor_id, 'adviento', p.fecha_aceptacion, p.version_politica, 'adviento', u.email_confirmed_at,
       case when p.avisos_email then null else now() end, p.creado_en
from public.adviento_perfiles p
join auth.users u on u.id = p.user_id
where p.acepto_politicas and p.suscriptor_id is not null
on conflict (suscriptor_id, lista) do nothing;

-- 4. Los enlaces de baja de correos del adviento ya enviados siguen funcionando ----------------
update public.suscriptores s set baja_token = p.baja_token
from public.adviento_perfiles p
where p.suscriptor_id = s.id and s.baja_token <> p.baja_token;
