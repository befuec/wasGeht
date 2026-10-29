-- =====================================================================
-- „Was geht?“ – Erinnerungen per Push (9 und 21 Uhr)
-- Voraussetzung: mehrere-familien.sql und sicherheit.sql sind ausgeführt.
-- Der Server speichert NUR die Push-Adresse des Geräts und die Uhrzeiten.
-- Welche Aufgaben offen sind, rechnet das Handy selbst aus (Ende-zu-Ende bleibt erhalten).
-- =====================================================================
create table if not exists public.push_subs (
  endpoint   text primary key,
  fam_id     uuid not null references public.families(id) on delete cascade,
  p256dh     text not null,
  auth       text not null,
  slots      int[] not null default '{9,21}',
  last_sent  text,
  created_at timestamptz not null default now()
);
alter table public.push_subs enable row level security;
revoke all on public.push_subs from anon, authenticated;

create or replace function public.fam_push_sub(p_code text, p_endpoint text, p_p256dh text, p_auth text, p_slots int[])
returns boolean language plpgsql volatile security definer set search_path = public, extensions as $$
declare f uuid;
begin
  perform public.fam_guard(); f := public.fam_resolve(p_code);
  if f is null then return false; end if;
  if p_endpoint !~ '^https://' or length(p_endpoint) > 1000 or length(coalesce(p_p256dh,'')) > 200 or length(coalesce(p_auth,'')) > 100 then
    raise exception 'Ungültige Push-Adresse' using errcode = '22023'; end if;
  if p_slots is null or array_length(p_slots,1) is null or array_length(p_slots,1) > 4 or exists (select 1 from unnest(p_slots) s where s < 0 or s > 23) then
    raise exception 'Ungültige Uhrzeiten' using errcode = '22023'; end if;
  if (select count(*) from public.push_subs where fam_id = f and endpoint <> p_endpoint) >= 20 then
    raise exception 'Zu viele Geräte' using errcode = 'PT429'; end if;
  insert into public.push_subs (endpoint, fam_id, p256dh, auth, slots) values (p_endpoint, f, p_p256dh, p_auth, p_slots)
  on conflict (endpoint) do update set fam_id = excluded.fam_id, p256dh = excluded.p256dh, auth = excluded.auth, slots = excluded.slots;
  return true;
end $$;

create or replace function public.fam_push_unsub(p_code text, p_endpoint text)
returns boolean language plpgsql volatile security definer set search_path = public, extensions as $$
declare f uuid;
begin
  perform public.fam_guard(); f := public.fam_resolve(p_code);
  if f is null then return false; end if;
  delete from public.push_subs where endpoint = p_endpoint and fam_id = f;
  return true;
end $$;

revoke all on function public.fam_push_sub(text,text,text,text,int[]), public.fam_push_unsub(text,text) from public;
grant execute on function public.fam_push_sub(text,text,text,text,int[]), public.fam_push_unsub(text,text) to anon, authenticated;

-- Zeitplan: jede volle Stunde die Edge Function „push-tick“ anstoßen (sie prüft selbst, ob es in Berlin 9 bzw. 21 Uhr ist)
create extension if not exists pg_cron;
create extension if not exists pg_net;
do $$ begin perform cron.unschedule('wasgeht-push'); exception when others then null; end $$;
select cron.schedule('wasgeht-push', '0 * * * *', $cron$
  select net.http_post(
    url     := 'https://klnjjherjqxiihxwaveh.supabase.co/functions/v1/push-tick',
    headers := jsonb_build_object('Content-Type','application/json','x-cron-secret','HIER_CRON_SECRET_EINSETZEN'),
    body    := '{}'::jsonb)
$cron$);

notify pgrst, 'reload schema';
select jobname, schedule from cron.job where jobname = 'wasgeht-push';
