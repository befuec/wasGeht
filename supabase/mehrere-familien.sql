-- =====================================================================
-- „Was geht?“ – Umstellung auf mehrere Familien (jede mit eigenem Code)
-- Supabase-Dashboard → SQL Editor → New query → alles einfügen → Run.
-- Einmalig ausführen. Bestehende Einträge bleiben erhalten: Sie gehören
-- automatisch zur Familie, die sich als erste mit dem bisherigen Code anmeldet.
-- =====================================================================
create extension if not exists pgcrypto with schema extensions;

-- 1) Familien und geheimer Schlüssel für die Code-Suche
create table if not exists public.families (
  id         uuid primary key default extensions.gen_random_uuid(),
  code_key   text not null unique,
  name       text,
  created_at timestamptz not null default now()
);
create table if not exists public.fam_pepper (id int primary key default 1 check (id = 1), k text not null);
insert into public.fam_pepper (id, k) values (1, encode(extensions.gen_random_bytes(32), 'hex')) on conflict (id) do nothing;
alter table public.families   enable row level security;
alter table public.fam_pepper enable row level security;
revoke all on public.families, public.fam_pepper from anon, authenticated;

-- 2) Einträge bekommen eine Familien-Zuordnung
alter table public.fam_entries add column if not exists fam_id uuid references public.families(id) on delete cascade;
alter table public.fam_entries drop constraint if exists fam_entries_pkey;
create unique index if not exists fam_entries_fam_kind_id on public.fam_entries (fam_id, kind, id);

-- 3) Hilfsfunktionen (nicht von außen aufrufbar)
create or replace function public.fam_key(p_code text)
returns text language sql stable security definer set search_path = public, extensions as $$
  select encode(extensions.hmac(coalesce(p_code,''), (select k from public.fam_pepper where id = 1), 'sha256'), 'hex');
$$;

create or replace function public.fam_resolve(p_code text)
returns uuid language plpgsql volatile security definer set search_path = public, extensions as $$
declare f uuid;
begin
  if coalesce(p_code,'') = '' then return null; end if;
  select id into f from public.families where code_key = public.fam_key(p_code);
  if f is not null then return f; end if;
  -- bisheriger Einzel-Code: einmalig in eine Familie umwandeln
  if to_regclass('public.fam_secret') is not null and exists (select 1 from public.fam_secret s where s.code_hash = extensions.crypt(p_code, s.code_hash)) then
    insert into public.families (code_key, name) values (public.fam_key(p_code), 'Familie') returning id into f;
    update public.fam_entries set fam_id = f where fam_id is null;
    delete from public.fam_secret;
    return f;
  end if;
  return null;
end $$;

-- 4) Öffentliche Funktionen (Zugriff nur mit Code)
drop function if exists public.fam_check(text);
create function public.fam_check(p_code text)
returns boolean language sql volatile security definer set search_path = public, extensions as $$
  select public.fam_resolve(p_code) is not null;
$$;

drop function if exists public.fam_list(text);
create function public.fam_list(p_code text)
returns table (kind text, id text, data jsonb, updated_at timestamptz)
language plpgsql volatile security definer set search_path = public, extensions as $$
declare f uuid := public.fam_resolve(p_code);
begin
  if f is null then raise exception 'Falscher Familien-Code' using errcode = '28000'; end if;
  return query select e.kind, e.id, e.data, e.updated_at from public.fam_entries e where e.fam_id = f;
end $$;

create or replace function public.fam_put(p_code text, p_kind text, p_id text, p_data jsonb)
returns timestamptz language plpgsql volatile security definer set search_path = public, extensions as $$
declare t timestamptz := now(); f uuid := public.fam_resolve(p_code);
begin
  if f is null then raise exception 'Falscher Familien-Code' using errcode = '28000'; end if;
  if p_data is null then
    delete from public.fam_entries where fam_id = f and kind = p_kind and id = p_id;
  else
    if length(p_data::text) > 20000 then raise exception 'Eintrag zu groß'; end if;
    insert into public.fam_entries (fam_id, kind, id, data, updated_at) values (f, p_kind, p_id, p_data, t)
    on conflict (fam_id, kind, id) do update set data = excluded.data, updated_at = t;
  end if;
  return t;
end $$;

create or replace function public.fam_create(p_code text, p_name text)
returns boolean language plpgsql volatile security definer set search_path = public, extensions as $$
begin
  if length(coalesce(p_code,'')) < 10 then raise exception 'Der Code braucht mindestens 10 Zeichen' using errcode = '22023'; end if;
  if public.fam_resolve(p_code) is not null then raise exception 'Dieser Code ist schon vergeben' using errcode = '23505'; end if;
  insert into public.families (code_key, name) values (public.fam_key(p_code), left(coalesce(p_name,''), 40));
  return true;
end $$;

drop function if exists public.fam_setcode(text,text);
create function public.fam_setcode(p_old text, p_new text)
returns boolean language plpgsql volatile security definer set search_path = public, extensions as $$
declare f uuid := public.fam_resolve(p_old);
begin
  if f is null then raise exception 'Falscher Familien-Code' using errcode = '28000'; end if;
  if length(coalesce(p_new,'')) < 10 then raise exception 'Der neue Code braucht mindestens 10 Zeichen' using errcode = '22023'; end if;
  if exists (select 1 from public.families where code_key = public.fam_key(p_new) and id <> f) then raise exception 'Dieser Code ist schon vergeben' using errcode = '23505'; end if;
  update public.families set code_key = public.fam_key(p_new) where id = f;
  return true;
end $$;

revoke all on function public.fam_key(text), public.fam_resolve(text) from public, anon, authenticated;
revoke all on function public.fam_check(text), public.fam_list(text), public.fam_put(text,text,text,jsonb), public.fam_create(text,text), public.fam_setcode(text,text) from public;
grant execute on function public.fam_check(text), public.fam_list(text), public.fam_put(text,text,text,jsonb), public.fam_create(text,text), public.fam_setcode(text,text) to anon, authenticated;

-- 5) OPTIONAL: Falls der alte Code nicht mehr bekannt ist und ihr schon eine neue
--    Familie in der App angelegt habt: alte Einträge (ohne Familie) der zuerst
--    angelegten Familie zuordnen. Dafür die zwei Striche vor der nächsten Zeile entfernen.
-- update public.fam_entries set fam_id = (select id from public.families order by created_at limit 1) where fam_id is null;

-- 6) Kontrolle
select (select count(*) from public.families) as familien, (select count(*) from public.fam_entries where fam_id is null) as noch_ohne_familie;
