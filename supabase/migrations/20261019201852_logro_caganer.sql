-- Sustituye el logro del día 3 por el hallazgo del caganer.
-- Solo la persona autenticada puede registrar este hallazgo para sí misma.
delete from public.adviento_logros where logro = 'conectada';

alter table public.adviento_logros drop constraint adviento_logros_logro_check;
alter table public.adviento_logros add constraint adviento_logros_logro_check
  check (logro in ('primera','tres','caganer','critica','sola','mitad','datos','vigilante','todas'));

grant insert (user_id, logro) on public.adviento_logros to authenticated;
create policy "caganer propio guardar" on public.adviento_logros for insert to authenticated
  with check ((select auth.uid()) = user_id and logro = 'caganer');

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
  if new.dia = 6 then insert into public.adviento_logros values (new.user_id, 'critica', now()) on conflict do nothing; end if;
  if new.dia = 7 then insert into public.adviento_logros values (new.user_id, 'sola', now()) on conflict do nothing; end if;
  if new.dia = 14 then insert into public.adviento_logros values (new.user_id, 'datos', now()) on conflict do nothing; end if;
  if new.dia = 22 then insert into public.adviento_logros values (new.user_id, 'vigilante', now()) on conflict do nothing; end if;
  return new;
end; $$;
