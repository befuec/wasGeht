/* Service Worker für „Was geht?“: App-Dateien offline verfügbar, Seite immer zuerst frisch aus dem Netz */
const CACHE = "wasgeht-__VER__";
const CORE = ["./", "./index.html", "./manifest.json", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png", "./icons/qr.svg",
  "./fonts/bricolage.woff", "./fonts/baloo2.woff", "./fonts/atkinson-Regular.woff", "./fonts/atkinson-Bold.woff", "./fonts/atkinson-Italic.woff"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("wasgeht-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;           // Supabase, Wetter usw. immer direkt
  if (r.mode === "navigate" || u.pathname.endsWith("/") || u.pathname.endsWith(".html")) {
    // Seite: Netz zuerst (max. 4 s), sonst gespeicherte Fassung
    e.respondWith((async () => {
      const c = await caches.open(CACHE);
      try {
        const net = await Promise.race([fetch(r), new Promise((_, no) => setTimeout(() => no(new Error("langsam")), 4000))]);
        if (net && net.ok) c.put("./index.html", net.clone());
        return net;
      } catch (_) { return (await c.match("./index.html")) || (await c.match("./")) || Response.error(); }
    })());
    return;
  }
  // Schriften, Symbole, Kalenderdateien: gespeichert liefern, im Hintergrund auffrischen
  e.respondWith((async () => {
    const c = await caches.open(CACHE), hit = await c.match(r);
    const net = fetch(r).then(res => { if (res && res.ok) c.put(r, res.clone()); return res; }).catch(() => null);
    return hit || (await net) || Response.error();
  })());
});

/* ===== Erinnerungen (Push um 9 und 21 Uhr) =====
   Der Server schickt nur einen Weckruf. Hier wird aus der vom Gerät gespeicherten Aufgabenliste (IndexedDB „wasgeht-sw“)
   und dem aktuellen Stand in Supabase berechnet, was für „mich“ und für niemanden zugeordnet noch offen ist. */
const SB_URL = "https://klnjjherjqxiihxwaveh.supabase.co", SB_KEY = "sb_publishable_mixDdB0UbIg2mTCKfz2dZA_5oQmRxE5";
const TE = new TextEncoder(), TD = new TextDecoder();
const b64 = u => { let s = ""; for (let i = 0; i < u.length; i += 8192) s += String.fromCharCode.apply(null, u.subarray(i, i + 8192)); return btoa(s); };
const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
const hex = u => [...u].map(b => b.toString(16).padStart(2, "0")).join("");
function idb(mode, fn) { return new Promise((ok, no) => { const q = indexedDB.open("wasgeht-sw", 1); q.onupgradeneeded = () => q.result.createObjectStore("kv");
  q.onerror = () => no(q.error); q.onsuccess = () => { const t = q.result.transaction("kv", mode), st = t.objectStore("kv"), r = fn(st); t.oncomplete = () => ok(r && r.result); t.onerror = () => no(t.error); }; }); }
const kvGet = k => idb("readonly", st => st.get(k));
const today = () => new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Berlin" });
async function encId(m, kind, id) { return "e" + hex(new Uint8Array(await crypto.subtle.sign("HMAC", m, TE.encode(kind + "/" + id)))).slice(0, 40); }
async function rpc(fn, args) { const r = await fetch(SB_URL + "/rest/v1/rpc/" + fn, { method: "POST", headers: { apikey: SB_KEY, "Content-Type": "application/json" }, body: JSON.stringify(args) });
  if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); }
async function openTasks() {
  const auth = await kvGet("auth"), ag = await kvGet("agenda");
  if (!auth || !ag) return null;
  const t0 = today(), me = ag.me;
  let L = (ag.items || []).filter(i => i.disp <= t0);
  try {   // aktuellen Stand holen: erledigt, verschoben, entfallen, umverteilt
    const rows = await rpc("fam_list", { p_code: auth.a }), ids = new Map(rows.map(r => [r.id, r]));
    const out = [];
    for (const i of L) {
      if (ids.has(await encId(auth.m, "settings", "hd:" + i.cid + ":" + i.d))) continue;
      const ov = ids.get(await encId(auth.m, "settings", "ho:" + i.cid + ":" + i.d));
      if (ov && ov.data && ov.data.ct) { try { const o = JSON.parse(TD.decode(await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(ov.data.iv) }, auth.k, unb64(ov.data.ct)))).d || {};
        if (o.skip || (o.to && o.to > t0)) continue; if (o.who) i.who = o.who; } catch (_) {} }
      out.push(i);
    }
    L = out;
  } catch (_) { L = L.filter(i => !i.dn); }
  return { me, meName: ag.meName, items: L.filter(i => { if (i.who && ag.groups && ag.groups[i.who]) i.team = ag.groups[i.who]; else if (i.who && !String(i.who).startsWith("@")) i.team = undefined; return !i.who || i.who === me || (Array.isArray(i.team) && i.team.includes(me)); }) };
}
async function showReminders(test) {
  const r = await openTasks(), opt = { icon: "icons/icon-192.png", badge: "icons/icon-192.png", lang: "de" };
  for (const n of await self.registration.getNotifications()) if ((n.tag || "").startsWith("wg-")) n.close();
  if (!r) return self.registration.showNotification("Was geht?", Object.assign({ body: "Bitte die App einmal öffnen, damit die Erinnerungen deine Aufgaben kennen.", tag: "wg-sum", data: { url: "./#zuhause" } }, opt));
  const L = r.items;
  if (!L.length) return self.registration.showNotification("✅ Alles erledigt", Object.assign({ body: test ? "Test: Gerade ist nichts offen für dich." : "Für dich ist gerade nichts offen. 🎉", tag: "wg-sum", data: { url: "./#zuhause" } }, opt));
  const mine = L.filter(i => i.who === r.me || (Array.isArray(i.team) && i.team.includes(r.me))).length, open = L.length - mine;
  const head = `📋 ${L.length} offen` + (mine && open ? ` · ${mine} für dich, ${open} ohne Person` : mine ? " für dich" : " · noch niemand zugeordnet");
  const show = L.slice(0, 4);
  for (const i of show) {
    await self.registration.showNotification(`${i.ic || "🏠"} ${i.ti}`, Object.assign({
      body: (Array.isArray(i.team) ? "Gemeinsam – Punkte werden geteilt" : i.who ? "Für dich" : "🙋 Noch niemand – übernimmst du?") + (i.disp < today() ? " · ⚠️ überfällig" : "") + ` · +${i.pts} Punkte`,
      tag: "wg-t-" + i.cid + "-" + i.d, renotify: false, data: { url: "./?abhaken=1#zuhause", item: i },
      actions: i.cid.startsWith("j:") ? [] : [{ action: "done", title: "✓ Erledigt" }, { action: "open", title: "Liste" }] }, opt));
  }
  if (L.length > show.length) await self.registration.showNotification(head, Object.assign({ body: L.slice(show.length).map(i => "• " + i.ti).join("\n"), tag: "wg-sum", data: { url: "./?abhaken=1#zuhause" } }, opt));
}
async function markDone(i) {
  const auth = await kvGet("auth"), ag = await kvGet("agenda"); if (!auth || !ag) return false;
  const t0 = today(), late = i.disp < t0 ? 1 : 0, data = { by: ag.me, pts: i.pts, min: i.min || 0, cat: i.cat, at: Date.now(), late, tk: 0, vol: i.who ? 0 : 1 }; if (Array.isArray(i.team) && i.team.length) { data.team = i.team; data.grp = i.who; }
  const iv = crypto.getRandomValues(new Uint8Array(12)), id = "hd:" + i.cid + ":" + i.d;
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, auth.k, TE.encode(JSON.stringify({ i: id, d: data }))));
  const r = await rpc("fam_put", { p_code: auth.a, p_kind: "settings", p_id: await encId(auth.m, "settings", id), p_data: { v: 2, iv: b64(iv), ct: b64(ct) } });
  return r !== null;
}
self.addEventListener("push", e => { e.waitUntil(showReminders(false).catch(() => self.registration.showNotification("Was geht?", { body: "Schau mal nach deinen Aufgaben.", tag: "wg-sum", icon: "icons/icon-192.png", data: { url: "./#zuhause" } }))); });
self.addEventListener("message", e => { const d = e.data || {}; if (d.t === "test-reminder") e.waitUntil(showReminders(true)); if (d.t === "test-done" && d.item) e.waitUntil(markDone(d.item));
  if (d.t === "test-list" && e.source) e.waitUntil(openTasks().then(r => e.source.postMessage({ t: "list", r }))); });
self.addEventListener("notificationclick", e => {
  const n = e.notification, d = n.data || {}; n.close();
  if (e.action === "done" && d.item) {
    e.waitUntil(markDone(d.item).then(ok => self.registration.showNotification(ok ? "✓ Erledigt" : "Hat nicht geklappt", { body: ok ? `${d.item.ti} – +${d.item.pts} Punkte` : "Bitte in der App abhaken.", tag: "wg-ok", icon: "icons/icon-192.png", data: { url: "./#zuhause" } }))
      .then(() => self.clients.matchAll({ type: "window" })).then(cs => cs.forEach(c => c.postMessage({ t: "reload-data" }))));
    return;
  }
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(cs => {
    const c = cs.find(x => x.url.startsWith(self.registration.scope));
    if (c) { c.postMessage({ t: "abhaken" }); return c.focus(); }
    return self.clients.openWindow(d.url || "./#zuhause");
  }));
});
