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
