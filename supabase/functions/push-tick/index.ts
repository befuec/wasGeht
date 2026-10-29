// Supabase Edge Function „push-tick“ – schickt um 9 und 21 Uhr (Europe/Berlin) einen Weckruf an die angemeldeten Geräte.
// Inhalt wird NICHT mitgeschickt: Das Handy rechnet die offenen Aufgaben selbst aus (Ende-zu-Ende-Verschlüsselung bleibt).
// Secrets: VAPID_PUBLIC, VAPID_PRIVATE, CRON_SECRET (SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY stellt Supabase selbst bereit).
// Einstellung: „Verify JWT“ AUS – der Aufruf ist über den Header x-cron-secret geschützt.
import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
webpush.setVapidDetails("https://befuec.github.io/wasGeht/", Deno.env.get("VAPID_PUBLIC")!, Deno.env.get("VAPID_PRIVATE")!);

function berlin(now = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hourCycle: "h23" })
    .formatToParts(now).map((x) => [x.type, x.value]));
  return { day: `${p.year}-${p.month}-${p.day}`, hour: +p.hour };
}

Deno.serve(async (req) => {
  if (req.headers.get("x-cron-secret") !== Deno.env.get("CRON_SECRET")) return new Response("nicht erlaubt", { status: 401 });
  const body = await req.json().catch(() => ({}));
  const { day, hour } = berlin();
  const h = typeof body.testHour === "number" ? body.testHour : hour;   // zum Testen: {"testHour": 9}
  const { data: subs, error } = await sb.from("push_subs").select("*").contains("slots", [h]);
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  let sent = 0, gone = 0, failed = 0;
  for (const s of subs ?? []) {
    const tag = `${day}-${h}`;
    if (s.last_sent === tag && typeof body.testHour !== "number") continue;
    try {
      await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, null, { TTL: 3 * 3600, urgency: "normal" });
      await sb.from("push_subs").update({ last_sent: tag }).eq("endpoint", s.endpoint);
      sent++;
    } catch (e) {
      const code = (e as { statusCode?: number }).statusCode;
      if (code === 404 || code === 410) { await sb.from("push_subs").delete().eq("endpoint", s.endpoint); gone++; } else failed++;
    }
  }
  return new Response(JSON.stringify({ day, hour: h, sent, gone, failed }), { headers: { "Content-Type": "application/json" } });
});
