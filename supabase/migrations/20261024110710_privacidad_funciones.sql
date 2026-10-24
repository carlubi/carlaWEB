-- Privacidad: que ninguna llamada desde la web pueda revelar datos de otra persona.

-- 1. Las funciones del envío de correos devuelven emails y nombres de todos los inscritos.
--    Solo las usa la función programada adviento-correo, con la clave de servicio.
revoke execute on function public.adviento_pendientes(smallint) from public, anon, authenticated;
revoke execute on function public.adviento_reservar_correo(uuid, smallint) from public, anon, authenticated;
grant execute on function public.adviento_pendientes(smallint) to service_role;
grant execute on function public.adviento_reservar_correo(uuid, smallint) to service_role;

-- 2. Disparador interno de Supabase: no tiene sentido llamarlo desde la API.
--    Solo existe en los proyectos alojados, no en la base local.
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end $$;

-- 3. Suscribirse siempre responde lo mismo, para no revelar si un correo ya estaba en la lista.
create or replace function public.suscribir(p_nombre text, p_email text, p_version text, p_origen text)
returns text language plpgsql security definer set search_path = '' as $$
declare
  v_baja timestamptz;
begin
  p_email  := lower(trim(p_email));
  p_nombre := trim(p_nombre);

  select baja_at into v_baja from public.suscriptores where email = p_email;
  if found then
    if v_baja is not null then
      update public.suscriptores
         set baja_at = null, nombre = p_nombre, consentimiento = true, version_politica = p_version
       where email = p_email;
    end if;
    return 'ok';
  end if;

  insert into public.suscriptores (nombre, email, consentimiento, version_politica, origen)
  values (p_nombre, p_email, true, p_version, p_origen);
  return 'ok';
exception when unique_violation then
  return 'ok';
end;
$$;
