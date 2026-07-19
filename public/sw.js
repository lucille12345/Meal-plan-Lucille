/* Table — service worker: offline app-shell cache (Phase 9 PWA).
   Bump CACHE when the shell changes so old caches are cleaned up. */
const CACHE = 'table-shell-v1';
const SHELL = [
  './',
  './index.html',
  './styles.css',
  './app-screens.css',
  './app.js',
  './config.js',
  './cloud.js',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-maskable.svg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;                       // never cache POSTs (AI calls, auth)
  const url = new URL(req.url);

  // Navigations: network-first, fall back to the cached app shell when offline.
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('./index.html')));
    return;
  }
  // Don't touch the backend API or cross-origin requests (Supabase, Unsplash, fonts) — just pass through.
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/generate-')) return;

  // Same-origin static assets: cache-first, then fill the cache in the background.
  e.respondWith(
    caches.match(req).then((hit) =>
      hit || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => hit)
    )
  );
});
