-- El prompt de cada número, para la página /prompts/<numero> con el botón «Copiar» que enlaza el correo.
alter table public.newsletter_numeros add column if not exists prompt text;

-- Público, pero solo el prompt (y el asunto) de números que ya han salido: los borradores no se ven.
create or replace function public.newsletter_prompt(p_numero int)
returns table (numero int, asunto text, prompt text)
language sql stable security definer set search_path = '' as $$
  select n.numero, n.asunto, n.prompt from public.newsletter_numeros n
  where n.numero = p_numero and n.estado in ('enviando', 'enviado') and n.prompt is not null;
$$;
revoke execute on function public.newsletter_prompt(int) from public;
grant execute on function public.newsletter_prompt(int) to anon, authenticated, service_role;
