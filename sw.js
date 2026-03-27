const CACHE = "reiseplaner-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/app.jsx",
  "/icon-180.png",
  "/icon-192.png",
  "/icon-512.png",
  "/manifest.json"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
