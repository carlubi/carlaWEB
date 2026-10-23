-- Autoriza a carlamunyozz@gmail.com a previsualizar y abrir cualquier día
-- del calendario de Adviento en producción.
do $$
begin
  if (
    select count(*)
    from auth.users
    where lower(email) = 'carlamunyozz@gmail.com'
      and email_confirmed_at is not null
  ) <> 1 then
    raise exception 'No se encuentra una única cuenta verificada para el acceso anticipado';
  end if;

  if not exists (
    select 1
    from auth.users u
    join public.adviento_perfiles p on p.user_id = u.id
    where lower(u.email) = 'carlamunyozz@gmail.com'
  ) then
    raise exception 'La cuenta autorizada aún no tiene perfil del calendario';
  end if;

  insert into private.adviento_administradores (user_id)
  select id
  from auth.users
  where lower(email) = 'carlamunyozz@gmail.com'
  on conflict do nothing;
end
$$;
