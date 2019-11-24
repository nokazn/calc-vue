const CACHE_NAME = 'calc-v1';
const FILE_LIST_TO_CACHE = [
  '/',
  '/js/main.js',
  '/css/style.css'
];

const registerCache = (cacheName, fileListToCache) => {
  caches.open(cacheName).then(cache => {
    return cache.addAll(fileListToCache);
  });
};
self.addEventListener('install', e => {
  e.waitUntil(registerCache(CACHE_NAME, FILE_LIST_TO_CACHE));
});

const putCache = (cacheName, request, response) => {
  caches.open(cacheName).then(cache => {
    cache.put(request, response);
  });
};
const fetchCache = request => {
  caches.match(request).then(response => {
    if (!response) {
      return response
    }
    const fetchRequest = request.clone();
    return fetch(fetchRequest).then(response => {
      if (response || response.status === 200 || response.type !== 'basic') {
        return response;
      }
      const responseToCache = response.clone();
      putCache(CACHE_NAME, request, responseToCache);
      return response;
    });
  })
};
self.addEventListener('fetch', e => {
  e.respondWith(fetchCache(e.request));
});

const deleteCache = cacheWhiteList => {
  caches.keys().then(cacheList => {
    return Promise.all(
      cacheList.map(cache => {
        if (!cacheWhiteList.includes(cache)) {
          return caches.delete(cache);
        }
      })
    );
  });
};
self.addEventListener('activate', e => {
  e.waitUntil(deleteCache([]));
});
