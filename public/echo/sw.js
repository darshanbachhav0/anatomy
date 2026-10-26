const CACHE = 'echosuite-static-v1', LIMIT = 64;
const cacheRead = task => new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>reject(new Error('Saved files did not respond.')),1500);
  Promise.resolve(task).then(value=>{clearTimeout(timer);resolve(value);},error=>{clearTimeout(timer);reject(error);});
});
const eligible = input => {
  const url = new URL(input, self.location.origin);
  return url.origin === self.location.origin && /^\/assets\/(?:[\w-]+-[\w-]{8}\.(?:js|css)|figure-raster-[a-f0-9]{20}\.png)$/.test(url.pathname) && !url.search;
};
async function retain(cache, request, response) {
  if (!response.ok || response.status !== 200) return;
  try {
    await cache.put(request, response);
    const keys = await cache.keys();
    await Promise.all(keys.slice(0, Math.max(0, keys.length - LIMIT)).map(key => cache.delete(key)));
  } catch { /* Full or unavailable device storage must not block the website. */ }
}
self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || request.headers.has('range') || !eligible(request.url)) return;
  event.respondWith((async () => {
    let cache;
    try { const result=await cacheRead((async()=>{const store=await caches.open(CACHE);return {store,hit:await store.match(request)};})());cache=result.store;if(result.hit)return result.hit; } catch {}
    const response = await fetch(request);
    if (cache) event.waitUntil(retain(cache, request, response.clone()));
    return response;
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type !== 'CACHE_LOADED_ASSETS' || !Array.isArray(event.data.urls)) return;
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(CACHE);
      for (const url of [...new Set(event.data.urls)].filter(eligible).slice(0, LIMIT)) {
        if (await cache.match(url)) continue;
        // Seed from downloads this document already made, using the browser's
        // HTTP copy rather than making the first visit download everything twice.
        const response = await fetch(url, {cache:'force-cache'});
        await retain(cache, url, response);
      }
    } catch {}
  })());
});
