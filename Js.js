// ODM World · offline cache
// Pages: network first (you always get the newest version when online), cache when offline.
// three.js + font: cache first (they never change).
// AI runtime from jsDelivr: kept after the first successful run so DEPTH_AI can work offline later.
// (The model weights themselves are cached by Transformers.js in its own browser cache.)
const VERSION = 'odm-2026-11-19d';
const RUNTIME = 'odm-runtime';
const CORE = ['./', 'index.html', 'game.html', 'body.html', 'terra.html', 'depth.html',
              'three.min.js', 'share-tech-mono.woff2', 'manifest.json', 'icon.svg'];
const RUNTIME_HOSTS = ['cdn.jsdelivr.net', 'cdnjs.cloudflare.com'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION)
    .then(c => Promise.allSettled(CORE.map(u => c.add(new Request(u, { cache: 'reload' })))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== RUNTIME).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(v => { clearTimeout(t); resolve(v); }, e => { clearTimeout(t); reject(e); });
  });
}

async function networkFirst(req) {
  const cache = await caches.open(VERSION);
  try {
    const res = await withTimeout(fetch(req), 5000);
    if (res && res.ok && !new URL(req.url).search) cache.put(req, res.clone());   // one copy per page, not per cache-busted URL
    return res;
  } catch (_) {
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    if (req.mode === 'navigate') { const home = await cache.match('index.html'); if (home) return home; }
    return new Response('Offline, and this page was never opened online.', { status: 503, headers: { 'Content-Type': 'text/plain' } });
  }
}

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
  return res;
}

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    const file = url.pathname.split('/').pop();
    const isPage = req.mode === 'navigate' || /\.html$/.test(file) || file === '' || file === 'manifest.json';
    if (isPage) event.respondWith(networkFirst(req));
    else if (CORE.includes(file) && !url.search) event.respondWith(cacheFirst(req, VERSION));
    // anything else on the site (e.g. TERRA_FORGE's FETCH / AUTO polling of a json file) is never cached
    return;
  }
  if (RUNTIME_HOSTS.includes(url.hostname)) event.respondWith(cacheFirst(req, RUNTIME));
  // everything else (Hugging Face model files, the URL-fetch proxy) goes straight to the network
});
