// Mejor Versión — funciona sin internet una vez abierta.
// Cuando cambies la app, sube este número (v1 -> v2) para que los teléfonos tomen la nueva versión.
const CACHE = 'mejor-version-v2';
const ASSETS = [
  './', './index.html', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png',
  './fonts/dela-gothic-one-latin-400-normal.woff2',
  './fonts/figtree-latin-400-normal.woff2', './fonts/figtree-latin-500-normal.woff2', './fonts/figtree-latin-600-normal.woff2',
  './fonts/figtree-latin-700-normal.woff2', './fonts/figtree-latin-800-normal.woff2',
  './fonts/ibm-plex-mono-latin-500-normal.woff2', './fonts/ibm-plex-mono-latin-600-normal.woff2'
];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (req.mode === 'navigate') {
    // Página: primero internet (para recibir cambios), si no hay, la copia guardada.
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put('./index.html', c)); return r; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
});
