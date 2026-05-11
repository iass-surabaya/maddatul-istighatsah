const CACHE_NAME = 'maddatul-istighatsah-v20
  '; // Versi dinaikkan agar HP otomatis update
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './sampul.jpg',
  './logo-header.png',
  './ornamen.png',
  './kompas-bg.png',
  './jarum-kiblat.png',
  // Membekukan Library Swiper agar banner tetap bisa digeser saat offline
  'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css',
  'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js',
  // Membekukan Font Arab agar tulisan tidak berubah jadi kotak-kotak saat offline
  'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Amiri+Quran&display=swap'
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
  const url = event.request.url;

  // PENGECUALIAN: Biarkan request POST dan API Dinamis lewat tanpa di-cache
  // (Urusan data offline sudah di-handle oleh Brankas LocalStorage di index.html)
  if (event.request.method !== 'GET' || 
      url.includes('script.google.com') || 
      url.includes('api.myquran.com') || 
      url.includes('api.alquran.cloud') || 
      url.includes('equran.id')) {
      return;
  }
  
  // STRATEGI CACHE-FIRST: Cari di HP dulu, kalau tidak ada baru minta ke internet
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Tampilkan dari memori HP (sangat cepat & bisa offline)
        }
        return fetch(event.request); // Ambil dari internet jika belum tersimpan
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
            return caches.delete(cacheName); // Hapus memori v13 dan versi lama lainnya
          }
        })
      );
    }).then(() => self.clients.claim()) // Ambil alih sistem aplikasi seketika
  );
});
