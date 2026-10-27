-- =====================================================================
-- HINWEIS: Danach zusätzlich supabase/mehrere-familien.sql ausführen – damit
--          kann jede Familie in der App ihren eigenen Code anlegen.
-- Ausflugsplaner „Was geht?“ – Supabase-Einrichtung mit Familien-Code
-- Im Supabase-Dashboard: SQL Editor → New query → alles einfügen → Run
-- VORHER: unten in Abschnitt 3 euren Familien-Code eintragen (mind. 12 Zeichen,
--         z. B. drei Wörter: „Elbe-Kastanie-Laterne“). Der Code wird nur als
--         Hash gespeichert, niemand kann ihn aus der Datenbank zurücklesen.
-- =====================================================================

-- 1) Erweiterung für sicheres Hashing
create extension if not exists pgcrypto with schema extensions;

-- 2) Tabellen
create table if not exists public.fam_entries (
  kind        text        not null check (kind in ('plans','maybe','busy','evwish','places','settings')),
  id          text        not null check (length(id) between 1 and 200),
  data        jsonb       not null,
  updated_at  timestamptz not null default now(),
  primary key (kind, id)
);
create table if not exists public.fam_secret (
  id        int  primary key default 1 check (id = 1),
  code_hash text not null
);

-- Direkter Zugriff gesperrt: RLS an, KEINE Policies → nur über die Funktionen unten
alter table public.fam_entries enable row level security;
alter table public.fam_secret  enable row level security;
revoke all on public.fam_entries, public.fam_secret from anon, authenticated;

-- 3) Familien-Code setzen  ⬇⬇⬇  HIER EUREN CODE EINTRAGEN  ⬇⬇⬇
insert into public.fam_secret (id, code_hash)
values (1, extensions.crypt('HIER-EUREN-CODE', extensions.gen_salt('bf', 10)))
on conflict (id) do update set code_hash = excluded.code_hash;

-- 4) Funktionen (einziger Zugang für die Seite)
create or replace function public.fam_ok(p_code text)
returns boolean language sql stable security definer set search_path = public, extensions as $$
  select exists (select 1 from public.fam_secret s where s.code_hash = extensions.crypt(coalesce(p_code,''), s.code_hash));
$$;

create or replace function public.fam_check(p_code text)
returns boolean language sql stable security definer set search_path = public, extensions as $$
  select public.fam_ok(p_code);
$$;

create or replace function public.fam_list(p_code text)
returns table (kind text, id text, data jsonb, updated_at timestamptz)
language plpgsql stable security definer set search_path = public, extensions as $$
begin
  if not public.fam_ok(p_code) then raise exception 'Falscher Familien-Code' using errcode = '28000'; end if;
  return query select e.kind, e.id, e.data, e.updated_at from public.fam_entries e;
end $$;

create or replace function public.fam_put(p_code text, p_kind text, p_id text, p_data jsonb)
returns timestamptz language plpgsql volatile security definer set search_path = public, extensions as $$
declare t timestamptz := now();
begin
  if not public.fam_ok(p_code) then raise exception 'Falscher Familien-Code' using errcode = '28000'; end if;
  if p_data is null then
    delete from public.fam_entries where kind = p_kind and id = p_id;
  else
    if length(p_data::text) > 20000 then raise exception 'Eintrag zu groß'; end if;
    insert into public.fam_entries (kind, id, data, updated_at) values (p_kind, p_id, p_data, t)
    on conflict (kind, id) do update set data = excluded.data, updated_at = t;
  end if;
  return t;
end $$;

revoke all on function public.fam_ok(text) from public, anon, authenticated;
revoke all on function public.fam_check(text), public.fam_list(text), public.fam_put(text,text,text,jsonb) from public;
grant execute on function public.fam_check(text), public.fam_list(text), public.fam_put(text,text,text,jsonb) to anon, authenticated;

-- 5) Kontrolle
select kind, count(*) from public.fam_entries group by kind order by kind;
