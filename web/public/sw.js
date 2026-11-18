/* Gatita service worker: lets the app open (and be installed) like a real app, even with the server out of reach.
 * It stores the app itself, the course content and the course PDF (network first: always the newest when online).
 * It NEVER touches the progress (/api/state): that always goes to the server, and the app keeps its own copy. */
const VERSION = 'v1';
const CACHE = 'gatita-' + VERSION;
const ROOT = new URL('./', self.location.href).href;

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll([ROOT, ROOT + 'manifest.webmanifest', ROOT + 'icon-192.png', ROOT + 'icon.svg'])).catch(() => undefined));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('gatita-') && k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

const cacheable = (res) => res && res.ok && res.type === 'basic' && res.status === 200;

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (cacheable(res)) await cache.put(request, res.clone());
  return res;
}

async function networkFirst(request, key) {
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(request);
    if (cacheable(res)) await cache.put(key || request, res.clone());
    return res;
  } catch (err) {
    const hit = await cache.match(key || request);
    if (hit) return hit;
    throw err;
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.headers.has('range')) return;
  if (/\/api\/courses\/[\w-]+\/pdf$/.test(url.pathname)) return event.respondWith(networkFirst(req));
  if (url.pathname.includes('/api/') || url.pathname.endsWith('/healthz')) return;
  if (req.mode === 'navigate') return event.respondWith(networkFirst(req, ROOT));
  if (/\/(assets|fonts|pdfjs)\//.test(url.pathname)) return event.respondWith(cacheFirst(req));
  event.respondWith(networkFirst(req));
});
