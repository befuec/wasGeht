-- =====================================================================
-- Familien-Code neu setzen + Funktion „Code ändern“ für die Einstellungen
-- Supabase-Dashboard → SQL Editor → New query → alles einfügen →
-- unten NEUEN-CODE ersetzen (mind. 8 Zeichen, z. B. drei Wörter) → Run
-- Der Code wird nur als Hash gespeichert.
-- =====================================================================

-- 1) Neuen Familien-Code setzen  ⬇⬇⬇  HIER EUREN NEUEN CODE EINTRAGEN  ⬇⬇⬇
insert into public.fam_secret (id, code_hash)
values (1, extensions.crypt('NEUER-CODE', extensions.gen_salt('bf', 10)))
on conflict (id) do update set code_hash = excluded.code_hash;

-- 2) Funktion, damit der Code künftig direkt in der App unter ⚙️ geändert werden kann
create or replace function public.fam_setcode(p_old text, p_new text)
returns boolean language plpgsql volatile security definer set search_path = public, extensions as $$
begin
  if not public.fam_ok(p_old) then raise exception 'Falscher Familien-Code' using errcode = '28000'; end if;
  if length(coalesce(p_new,'')) < 8 then raise exception 'Der neue Code braucht mindestens 8 Zeichen' using errcode = '22023'; end if;
  update public.fam_secret set code_hash = extensions.crypt(p_new, extensions.gen_salt('bf', 10)) where id = 1;
  return true;
end $$;
revoke all on function public.fam_setcode(text,text) from public;
grant execute on function public.fam_setcode(text,text) to anon, authenticated;

-- 3) Kontrolle (muss „true“ zeigen, wenn der Code oben stimmt)
select public.fam_ok('NEUER-CODE') as code_ok;
