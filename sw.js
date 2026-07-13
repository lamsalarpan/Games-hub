/* Game Hub — offline service worker.

   Strategy: network-first for everything same-origin, falling back to
   cache only when the network is unavailable. This means:
     - Online: you always get the latest files (no more "stuck on an old
       broken build" — the classic failure mode of cache-first SWs).
     - Offline: whatever was last successfully fetched (or precached via
       "Play Offline") still works, with zero network required.

   Bump CACHE_NAME whenever this list changes so old caches get swept. */

const CACHE_NAME = 'game-hub-v6';
const NETWORK_TIMEOUT_MS = 3500;

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  './assets/css/theme.css',
  './assets/js/common.js',
  './faviconset/favicon.ico',
  './faviconset/favicon-16x16.png',
  './faviconset/favicon-32x32.png',
  './faviconset/android-chrome-192x192.png',
  './faviconset/android-chrome-512x512.png',
  './faviconset/apple-touch-icon.png',
  './flappy/index.html',
  './dino/index.html',
  './Road-fighter/index.html',
  './tic-tac-toe/index.html',
  './snake/index.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch(() => {}) // don't let a single missing asset block install
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(
      names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
    )).then(() => self.clients.claim())
  );
});

function timeoutPromise(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms));
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // let cross-origin (fonts, CDN) pass through normally

  event.respondWith(
    Promise.race([fetch(req), timeoutPromise(NETWORK_TIMEOUT_MS)])
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html')))
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'PRECACHE_ALL') {
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS));
  }
});
