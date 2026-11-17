const CACHE_NAME = "gd-cache-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./apple-touch-icon.png",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  // Network first, fallback to cache for static assets
  if (e.request.url.includes("firebasedatabase.app")) {
    return; // Pass realtime database requests directly to network
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
