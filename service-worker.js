const CACHE = 'se-mouv-1d-v1';
const APP = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', event => { self.skipWaiting(); event.waitUntil(caches.open(CACHE).then(c => c.addAll(APP))); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request).then(response => {
    const copy=response.clone(); caches.open(CACHE).then(c => c.put(event.request, copy)); return response;
  }).catch(() => caches.match(event.request).then(r => r || caches.match('./index.html'))));
});
