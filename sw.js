/* ======================= sw.js (Service Worker - Versión Final v4) ================== */
// IMPORTANTE: Cambio de versión a v4 para forzar la actualización de script.js (Modo Cine) y index.html (Textos)
const CACHE_NAME = 'marian-crochet-v4';

// Lista completa de archivos para que la App funcione Offline
const FILES_TO_CACHE = [
  './', 
  './index.html',
  './manifest.json',
  './style.css',
  './script.js',
  './vivirapp.html', // Archivo del footer
  
  // UI General
  './images/logo.png',
  './images/icono.jpg',
  './images/banner.jpg',
  './images/vivirapp.png',
  './images/fondo.jpg',
  './images/header.jpg',
  
  // Imágenes de Productos (Anteriores .jpg)
  './images/snoopy.jpg',
  './images/coneja.jpg',
  './images/capi.jpg',
  './images/rosas.jpg',
  './images/mazul.jpg',
  './images/mrosa.jpg',
  './images/hello.jpg',
  './images/vegeta.jpg',
  './images/harry.jpg',
  './images/porta.jpg',
  './images/kpop.jpg',
  './images/kpop2.jpg',
  './images/perry.jpg',
  './images/wasosky.jpg',

  // NUEVAS Imágenes de Productos (.jpeg)
  './images/llavero_atm.jpeg',
  './images/separador_rana.jpeg',
  './images/separador_abeja.jpeg',
  './images/muñeco_escurrigato.jpeg',
  './images/personalizado_profesora.jpeg',
  './images/personalizado_abuela.jpeg',
  './images/accesorio_navidad.jpeg'
];

/* ====================== Evento: Install =========================== */
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Instalando v4 y almacenando archivos...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(FILES_TO_CACHE);
      })
      .catch(err => console.error('[ServiceWorker] Error caching files:', err))
  );
  self.skipWaiting(); // Activar inmediatamente
});

/* ========================= Evento: Activate ======================= */
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activando y limpiando caches viejos...');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        // Borramos todo caché que no sea el actual ('marian-crochet-v4')
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Borrando caché antiguo:', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

/* ======================= Evento: Fetch =============================== */
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 1. Si está en caché, lo devuelve (Velocidad máxima)
        if (response) {
          return response;
        }
        
        // 2. Si no, lo busca en internet
        return fetch(event.request)
          .then((networkResponse) => {
            // Verificar si la respuesta es válida
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // 3. Guardar copia en caché para la próxima vez
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          })
          .catch(() => {
            console.log('[ServiceWorker] Modo offline: Recurso no encontrado');
          });
      })
  );
});