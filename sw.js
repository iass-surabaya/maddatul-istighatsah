const CACHE_NAME = 'maddatul-istighatsah-v13'; // Versi dinaikkan agar HP otomatis update
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './sampul.jpg'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Memaksa HP untuk langsung menggunakan Service Worker baru ini
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // Biarkan request POST dan API Google Sheets lewat tanpa di-cache
  if (event.request.method !== 'GET' || event.request.url.includes('script.google.com')) {
      return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Hapus memori v12 dan versi lama lainnya
          }
        })
      );
    }).then(() => self.clients.claim()) // Ambil alih sistem aplikasi seketika
  );
});
