const CACHE_NAME = 'nokazn-calc-vue-v1';
const FILE_LIST_TO_CACHE = [
  '/',
  '/js/main.js',
  '/css/style.css'
];

const registerCache = (cacheName, fileListToCache) => {
  return caches.open(cacheName).then(cache => {
    return cache.addAll(fileListToCache);
  });
};
self.addEventListener('install', async () => {
  await registerCache(CACHE_NAME, FILE_LIST_TO_CACHE);
});

const putCache = (cacheName, request, response) => {
  return caches.open(cacheName).then(cache => {
    cache.put(request, response);
  });
};
const fetchCache = request => {
  return caches.match(request)
  .then(response => {
    if (response) {
      return response
    }
    const fetchRequest = request.clone();
    return fetch(fetchRequest)
    .then(response => {
      if (response && response.status === 200 && response.type === 'basic') {
        const responseToCache = response.clone();
        putCache(CACHE_NAME, request, responseToCache);
      }
      return response;
    }).catch(e => {
      console.error(e);
    });
  })
  .catch(e => {
    console.error(e);
  });
};
self.addEventListener('fetch', e => {
  e.respondWith(fetchCache(e.request));
});

const deleteCache =  cacheWhiteList => {
  return caches.keys().then(cacheList => {
    Promise.all(
      cacheList.map(cache => {
        if (!cacheWhiteList.includes(cache)) {
          return caches.delete(cache);
        }
      })
    );
  });
};
self.addEventListener('activate', e => {
  e.waitUntil(deleteCache([CACHE_NAME]));
});
