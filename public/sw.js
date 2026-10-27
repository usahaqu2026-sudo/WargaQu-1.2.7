/**
 * WargaQu 1.2.7 - Service Worker (Offline-First for GitHub Pages & Android/iOS)
 * Path Relatif compliant: Safe for sub-directories (e.g., https://username.github.io/repo-name/)
 */

const CACHE_NAME = 'wargaqu-cache-v1.2.7';

// Core assets to precache immediately on install (all using relative paths)
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './version.json',
  './favicon.svg',
  './apple-touch-icon.png',
  './pwa-192x192.png',
  './pwa-512x512.png',
  './pwa-maskable-512x512.png'
];

// 1. INSTALL EVENT: Pre-cache core shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Precache critical files gracefully (won't abort if single secondary asset 404s)
      for (const asset of PRECACHE_ASSETS) {
        try {
          await cache.add(asset);
        } catch (err) {
          console.warn(`[WargaQu SW] Gagal pre-cache ${asset}:`, err);
        }
      }
    }).then(() => self.skipWaiting())
  );
});

// 2. ACTIVATE EVENT: Clean up stale caches & claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log(`[WargaQu SW] Menghapus cache usang: ${key}`);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. FETCH EVENT: Intelligent Caching Strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle HTTP/HTTPS GET requests
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return;
  }

  // A. Navigation Request (HTML pages): Network-first with offline fallback to cached index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cachedIndex = await caches.match('./index.html') || await caches.match('./');
          if (cachedIndex) return cachedIndex;
          return new Response(
            `<!DOCTYPE html>
            <html lang="id">
            <head><meta charset="UTF-8"><title>WargaQu Offline</title></head>
            <body style="font-family:system-ui;background:#064e3b;color:white;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;padding:20px;text-align:center;">
              <div>
                <h2>WargaQu Sedang Offline</h2>
                <p>Data tersimpan di perangkat Anda. Sambungkan internet untuk sinkronisasi terbaru.</p>
                <button onclick="window.location.reload()" style="background:#10b981;color:white;border:none;padding:10px 20px;border-radius:8px;font-weight:bold;cursor:pointer;">Muat Ulang</button>
              </div>
            </body>
            </html>`,
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // B. Static Assets (JS, CSS, Images, Fonts): Cache-First with Network fallback & cache update
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached immediately, fetch updated asset in background if online (Stale-While-Revalidate)
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          })
          .catch(() => {/* Offline, use cached */});
        return cachedResponse;
      }

      // Not in cache, fetch from network and store in cache
      return fetch(request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // Fallback placeholder for images if offline
          if (request.destination === 'image') {
            return caches.match('./favicon.svg');
          }
        });
    })
  );
});

// 4. MESSAGE EVENT: Allow app to trigger skipWaiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
