// Bumped whenever this file's caching logic changes — bumping it also
// forces every already-installed client to purge its old cache on next
// activate, which matters here: v1 had a bug (see below) that could leave
// stale API responses sitting in the cache, and this is what clears them.
const CACHE_NAME = 'tractap-shell-v1';

const SHELL_FILES = [
  './',
  './index.html',
  './config.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Precomputed absolute URLs for exactly the shell files above. This is the
// fix: v1 decided "is this a shell file?" using same-origin as a proxy,
// which incorrectly also matched every API call, since the backend lives
// on the same domain as the frontend (different path, same origin). That
// let live data — venue status, the request queue — get cached and served
// back stale, e.g. a venue deleted directly in the database would still
// appear "live" to the app until the cache happened to expire.
const SHELL_URLS = new Set(SHELL_FILES.map((f) => new URL(f, self.registration.scope).href));

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (!SHELL_URLS.has(event.request.url)) return; // not a shell file — never touch it, ever

  // Network-first: this is a live-event app, so showing anything stale —
  // even the app shell itself — is worse than a brief loading moment.
  // The cache is only a fallback for when the device is truly offline.
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
