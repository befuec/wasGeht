-- =====================================================================
-- „Was geht?“ – Sicherheitspaket
-- Voraussetzung: mehrere-familien.sql wurde schon ausgeführt.
-- Supabase-Dashboard → SQL Editor → New query → alles einfügen → Run.
-- Mehrfaches Ausführen schadet nicht.
--
-- Enthält:
--  • Sperre nach zu vielen falschen Codes (pro Gerät und insgesamt)
--  • Grenzen für neue Familien und Einträge pro Familie
--  • Codes zusätzlich mit bcrypt geschützt
--  • Papierkorb (30 Tage) und wöchentliche Sicherungen (letzte 4) in der Datenbank
--  • Umstellung auf Ende-zu-Ende-Verschlüsselung (die App verschlüsselt selbst)
--  • „Familie und alle Daten löschen“
--  • fam_ping für den Wachhalter (GitHub)
-- =====================================================================
create extension if not exists pgcrypto with schema extensions;

-- 1) Tabellen
alter table public.families add column if not exists code_hash text;
alter table public.families add column if not exists last_snap timestamptz;

create table if not exists public.fam_attempts (
  id bigserial primary key,
  at timestamptz not null default now(),
  ip text,
  kind text not null            -- 'fail' | 'create'
);
create index if not exists fam_attempts_at on public.fam_attempts (at);

create table if not exists public.fam_trash (
  fam_id uuid not null references public.families(id) on delete cascade,
  kind text not null, id text not null, data jsonb not null,
  deleted_at timestamptz not null default now()
);
create index if not exists fam_trash_fam on public.fam_trash (fam_id, deleted_at);

create table if not exists public.fam_snapshots (
  id bigserial primary key,
  fam_id uuid not null references public.families(id) on delete cascade,
  at timestamptz not null default now(),
  rows jsonb not null
);
create index if not exists fam_snapshots_fam on public.fam_snapshots (fam_id, at);

alter table public.fam_attempts  enable row level security;
alter table public.fam_trash     enable row level security;
alter table public.fam_snapshots enable row level security;
revoke all on public.fam_attempts, public.fam_trash, public.fam_snapshots from anon, authenticated;

-- 2) Hilfsfunktionen (intern)
create or replace function public.fam_ip()
returns text language sql stable as $$
  select coalesce(
    nullif(split_part(coalesce((current_setting('request.headers', true))::json->>'x-forwarded-for',''), ',', 1), ''),
    (current_setting('request.headers', true))::json->>'cf-connecting-ip',
    'unbekannt');
$$;

create or replace function public.fam_guard()
returns void language plpgsql volatile security definer set search_path = public, extensions as $$
declare v_ip text := public.fam_ip();
begin
  delete from public.fam_attempts a where a.at < now() - interval '2 days';
  if (select count(*) from public.fam_attempts a where a.kind = 'fail' and a.ip = v_ip and a.at > now() - interval '1 hour') >= 10
     or (select count(*) from public.fam_attempts a where a.kind = 'fail' and a.at > now() - interval '1 hour') >= 300 then
    raise exception 'Zu viele falsche Versuche – bitte in einer Stunde nochmal' using errcode = 'PT429';
  end if;
end $$;

-- Auflösen: Schlüssel-Suche (HMAC) + Prüfung mit bcrypt; Fehlversuche werden gezählt
create or replace function public.fam_resolve(p_code text)
returns uuid language plpgsql volatile security definer set search_path = public, extensions as $$
declare f uuid; h text;
begin
  if coalesce(p_code,'') = '' then return null; end if;
  select id, code_hash into f, h from public.families where code_key = public.fam_key(p_code);
  if f is not null then
    if h is null then
      update public.families set code_hash = extensions.crypt(p_code, extensions.gen_salt('bf', 8)) where id = f;
      return f;
    end if;
    if h = extensions.crypt(p_code, h) then return f; end if;
  end if;
  -- alter Einzel-Code aus der allerersten Version
  if to_regclass('public.fam_secret') is not null and exists (select 1 from public.fam_secret s where s.code_hash = extensions.crypt(p_code, s.code_hash)) then
    insert into public.families (code_key, code_hash, name) values (public.fam_key(p_code), extensions.crypt(p_code, extensions.gen_salt('bf', 8)), 'Familie') returning id into f;
    update public.fam_entries set fam_id = f where fam_id is null;
    delete from public.fam_secret;
    return f;
  end if;
  perform public.fam_guard();
  insert into public.fam_attempts (ip, kind) values (public.fam_ip(), 'fail');
  return null;
end $$;

-- Wöchentliche Sicherung der eigenen Einträge (letzte 4 bleiben)
create or replace function public.fam_snap_if_due(f uuid)
returns void language plpgsql volatile security definer set search_path = public, extensions as $$
begin
  if exists (select 1 from public.families where id = f and (last_snap is null or last_snap < now() - interval '7 days'))
     and exists (select 1 from public.fam_entries where fam_id = f) then
    insert into public.fam_snapshots (fam_id, rows)
      select f, coalesce(jsonb_agg(jsonb_build_object('kind', kind, 'id', id, 'data', data)), '[]'::jsonb) from public.fam_entries where fam_id = f;
    update public.families set last_snap = now() where id = f;
    delete from public.fam_snapshots where fam_id = f and id not in (select id from public.fam_snapshots where fam_id = f order by at desc limit 4);
  end if;
  delete from public.fam_trash where fam_id = f and deleted_at < now() - interval '30 days';
end $$;

-- 3) Öffentliche Funktionen
create or replace function public.fam_ping()
returns boolean language sql stable as $$ select true; $$;

drop function if exists public.fam_check(text);
create function public.fam_check(p_code text)
returns boolean language plpgsql volatile security definer set search_path = public, extensions as $$
begin
  perform public.fam_guard();
  return public.fam_resolve(p_code) is not null;
end $$;

drop function if exists public.fam_list(text);
create function public.fam_list(p_code text)
returns table (kind text, id text, data jsonb, updated_at timestamptz)
language plpgsql volatile security definer set search_path = public, extensions as $$
declare f uuid;
begin
  perform public.fam_guard();
  f := public.fam_resolve(p_code);
  if f is null then return query select '_auth'::text, 'fail'::text, null::jsonb, now(); return; end if;
  perform public.fam_snap_if_due(f);
  return query select e.kind, e.id, e.data, e.updated_at from public.fam_entries e where e.fam_id = f;
end $$;

create or replace function public.fam_put(p_code text, p_kind text, p_id text, p_data jsonb)
returns timestamptz language plpgsql volatile security definer set search_path = public, extensions as $$
declare t timestamptz := now(); f uuid;
begin
  perform public.fam_guard(); f := public.fam_resolve(p_code);
  if f is null then return null; end if;
  if p_data is null then
    insert into public.fam_trash (fam_id, kind, id, data)
      select fam_id, kind, id, data from public.fam_entries where fam_id = f and kind = p_kind and id = p_id;
    delete from public.fam_entries where fam_id = f and kind = p_kind and id = p_id;
  else
    if length(p_data::text) > 40000 then raise exception 'Eintrag zu groß' using errcode = '22023'; end if;
    if not exists (select 1 from public.fam_entries where fam_id = f and kind = p_kind and id = p_id)
       and (select count(*) from public.fam_entries where fam_id = f) >= 5000 then
      raise exception 'Zu viele Einträge für eine Familie' using errcode = '22023';
    end if;
    insert into public.fam_entries (fam_id, kind, id, data, updated_at) values (f, p_kind, p_id, p_data, t)
    on conflict (fam_id, kind, id) do update set data = excluded.data, updated_at = t;
  end if;
  return t;
end $$;

-- Alle Einträge auf einmal ersetzen (Umstellung auf Verschlüsselung, neuer Code)
create or replace function public.fam_replace_all(p_code text, p_rows jsonb)
returns integer language plpgsql volatile security definer set search_path = public, extensions as $$
declare f uuid; n int;
begin
  perform public.fam_guard(); f := public.fam_resolve(p_code);
  if f is null then return -1; end if;
  if jsonb_typeof(p_rows) <> 'array' or jsonb_array_length(p_rows) > 5000 then raise exception 'Ungültige Daten' using errcode = '22023'; end if;
  delete from public.fam_entries where fam_id = f;
  -- Komplett-Ersatz (Umstellung auf Verschlüsselung / neuer Code): alte Klartext- bzw. alt-verschlüsselte Kopien mit entfernen
  delete from public.fam_trash where fam_id = f;
  delete from public.fam_snapshots where fam_id = f;
  update public.families set last_snap = null where id = f;
  insert into public.fam_entries (fam_id, kind, id, data, updated_at)
    select f, r->>'kind', r->>'id', r->'data', now() from jsonb_array_elements(p_rows) r
    where r->>'kind' in ('plans','maybe','busy','evwish','places','settings') and length(r->>'id') between 1 and 200 and length((r->'data')::text) <= 40000
    on conflict (fam_id, kind, id) do update set data = excluded.data, updated_at = now();
  get diagnostics n = row_count;
  delete from public.fam_trash where fam_id = f;
  return n;
end $$;

create or replace function public.fam_create(p_code text, p_name text)
returns boolean language plpgsql volatile security definer set search_path = public, extensions as $$
begin
  perform public.fam_guard();
  if length(coalesce(p_code,'')) < 10 then raise exception 'Der Code ist zu kurz' using errcode = '22023'; end if;
  if (select count(*) from public.fam_attempts where kind = 'create' and ip = public.fam_ip() and at > now() - interval '1 day') >= 5
     or (select count(*) from public.fam_attempts where kind = 'create' and at > now() - interval '1 day') >= 50 then
    raise exception 'Heute wurden schon zu viele Familien angelegt – bitte morgen nochmal' using errcode = 'PT429';
  end if;
  if exists (select 1 from public.families where code_key = public.fam_key(p_code)) then raise exception 'Dieser Code ist schon vergeben' using errcode = '23505'; end if;
  insert into public.families (code_key, code_hash, name) values (public.fam_key(p_code), extensions.crypt(p_code, extensions.gen_salt('bf', 8)), left(coalesce(p_name,''), 40));
  insert into public.fam_attempts (ip, kind) values (public.fam_ip(), 'create');
  return true;
end $$;

drop function if exists public.fam_setcode(text,text);
create function public.fam_setcode(p_old text, p_new text)
returns boolean language plpgsql volatile security definer set search_path = public, extensions as $$
declare f uuid;
begin
  perform public.fam_guard(); f := public.fam_resolve(p_old);
  if f is null then return false; end if;
  if length(coalesce(p_new,'')) < 10 then raise exception 'Der neue Code ist zu kurz' using errcode = '22023'; end if;
  if exists (select 1 from public.families where code_key = public.fam_key(p_new) and id <> f) then raise exception 'Dieser Code ist schon vergeben' using errcode = '23505'; end if;
  update public.families set code_key = public.fam_key(p_new), code_hash = extensions.crypt(p_new, extensions.gen_salt('bf', 8)), last_snap = null where id = f;
  delete from public.fam_snapshots where fam_id = f;  -- alte Sicherungen passen nicht mehr zum neuen Schlüssel
  return true;
end $$;

-- Papierkorb & Sicherungen
create or replace function public.fam_trash_list(p_code text)
returns table (kind text, id text, data jsonb, deleted_at timestamptz)
language plpgsql volatile security definer set search_path = public, extensions as $$
declare f uuid;
begin
  perform public.fam_guard(); f := public.fam_resolve(p_code);
  if f is null then return; end if;
  return query select t.kind, t.id, t.data, t.deleted_at from public.fam_trash t where t.fam_id = f and t.deleted_at > now() - interval '30 days' order by t.deleted_at desc limit 300;
end $$;

create or replace function public.fam_restore(p_code text, p_kind text, p_id text)
returns boolean language plpgsql volatile security definer set search_path = public, extensions as $$
declare f uuid; d jsonb;
begin
  perform public.fam_guard(); f := public.fam_resolve(p_code);
  if f is null then return false; end if;
  select data into d from public.fam_trash where fam_id = f and kind = p_kind and id = p_id order by deleted_at desc limit 1;
  if d is null then return false; end if;
  insert into public.fam_entries (fam_id, kind, id, data, updated_at) values (f, p_kind, p_id, d, now())
  on conflict (fam_id, kind, id) do update set data = excluded.data, updated_at = now();
  delete from public.fam_trash where fam_id = f and kind = p_kind and id = p_id;
  return true;
end $$;

create or replace function public.fam_snap_list(p_code text)
returns table (id bigint, at timestamptz, n integer)
language plpgsql volatile security definer set search_path = public, extensions as $$
declare f uuid;
begin
  perform public.fam_guard(); f := public.fam_resolve(p_code);
  if f is null then return; end if;
  return query select s.id, s.at, jsonb_array_length(s.rows) from public.fam_snapshots s where s.fam_id = f order by s.at desc;
end $$;

create or replace function public.fam_snap_restore(p_code text, p_snap bigint)
returns integer language plpgsql volatile security definer set search_path = public, extensions as $$
declare f uuid; r jsonb;
begin
  perform public.fam_guard(); f := public.fam_resolve(p_code);
  if f is null then return -1; end if;
  select rows into r from public.fam_snapshots where id = p_snap and fam_id = f;
  if r is null then return 0; end if;
  insert into public.fam_trash (fam_id, kind, id, data) select fam_id, kind, id, data from public.fam_entries where fam_id = f;
  delete from public.fam_entries where fam_id = f;
  insert into public.fam_entries (fam_id, kind, id, data, updated_at)
    select f, x->>'kind', x->>'id', x->'data', now() from jsonb_array_elements(r) x;
  return jsonb_array_length(r);
end $$;

-- Familie und alle Daten endgültig löschen
create or replace function public.fam_delete(p_code text)
returns boolean language plpgsql volatile security definer set search_path = public, extensions as $$
declare f uuid;
begin
  perform public.fam_guard(); f := public.fam_resolve(p_code);
  if f is null then return false; end if;
  delete from public.fam_entries where fam_id = f;
  delete from public.families where id = f;
  return true;
end $$;

-- 4) Rechte
revoke all on function public.fam_key(text), public.fam_resolve(text), public.fam_guard(), public.fam_ip(), public.fam_snap_if_due(uuid) from public, anon, authenticated;
revoke all on function public.fam_check(text), public.fam_list(text), public.fam_put(text,text,text,jsonb), public.fam_create(text,text), public.fam_setcode(text,text),
  public.fam_replace_all(text,jsonb), public.fam_trash_list(text), public.fam_restore(text,text,text), public.fam_snap_list(text), public.fam_snap_restore(text,bigint), public.fam_delete(text), public.fam_ping() from public;
grant execute on function public.fam_check(text), public.fam_list(text), public.fam_put(text,text,text,jsonb), public.fam_create(text,text), public.fam_setcode(text,text),
  public.fam_replace_all(text,jsonb), public.fam_trash_list(text), public.fam_restore(text,text,text), public.fam_snap_list(text), public.fam_snap_restore(text,bigint), public.fam_delete(text), public.fam_ping() to anon, authenticated;

-- 5) Kontrolle
select (select count(*) from public.families) as familien,
       (select count(*) from public.families where code_hash is null) as noch_ohne_bcrypt,
       (select count(*) from public.fam_entries) as eintraege;

-- PostgREST soll die neuen Funktionen sofort kennen
notify pgrst, 'reload schema';
