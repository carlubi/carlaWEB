-- Tablas de la newsletter semanal. La tarea programada de Claude guarda cada número como borrador
-- (con el conector de Supabase); enviar-newsletter solo envía los aprobados.
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

-- Sin acceso desde la web.
alter table public.newsletter_numeros enable row level security;
alter table public.newsletter_envios enable row level security;
revoke all on public.newsletter_numeros, public.newsletter_envios from public, anon, authenticated;
grant select, insert, update, delete on public.newsletter_numeros, public.newsletter_envios to service_role;
