/* Game Hub — offline service worker.
   Cache-first for everything same-origin, so once a visit has warmed
   the cache (or the person taps "Play Offline"), every game keeps
   working with no connection at all. Bump CACHE_NAME when files change
   so returning visitors pick up the new versions. */

const CACHE_NAME = 'game-hub-v2';

const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  './assets/css/theme.css',
  './assets/js/common.js',
  './faviconset/favicon.ico',
  './faviconset/favicon-16.png',
  './faviconset/favicon-32.png',
  './faviconset/favicon-48.png',
  './faviconset/favicon-192.png',
  './faviconset/favicon-180.png',
  './flappy/index.html',
  './dino/index.html',
  './Road-fighter/index.html',
  './tic-tac-toe/index.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(
      names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // let cross-origin (fonts, CDN) pass through normally

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return res;
      }).catch(() => cached);
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'PRECACHE_ALL') {
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS));
  }
});
