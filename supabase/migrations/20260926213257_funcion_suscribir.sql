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

-- La web ya no inserta directamente: todo pasa por la función.
drop policy if exists "alta desde la landing" on public.suscriptores;
revoke insert (nombre, email, consentimiento, version_politica, origen) on public.suscriptores from anon;;
