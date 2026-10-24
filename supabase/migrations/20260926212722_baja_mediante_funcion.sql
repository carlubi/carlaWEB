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
grant execute on function public.darse_de_baja(uuid) to anon;;
