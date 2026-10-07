const CACHE_NAME = 'gootv-cache-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['./', './index.html', './favicon.svg']);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only cache GET requests to static assets, pass API and streaming embeds through directly
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.protocol.startsWith('chrome-extension')) return;

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((res) => {
        return res || caches.match('./index.html');
      });
    })
  );
});
