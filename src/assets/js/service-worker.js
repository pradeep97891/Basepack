// service-worker.js

const CACHE_NAME = 'my-react-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html', // Make sure this matches your entry point HTML file
  // Add other static assets (CSS, JS, images) that you want to cache
];

self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => {
          return cache.addAll(urlsToCache)
            .catch(error => {
              console.error('Failed to cache resources:', error);
            });
        })
    );
  });
  
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Cache hit - return response
          if (response) {
            return response;
          }
  
          // Clone the request to make sure it can be consumed once again
          const fetchRequest = event.request.clone();
  
          return fetch(fetchRequest)
            .then(response => {
              // Check if we received a valid response
              if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
  
              // Clone the response
              const responseToCache = response.clone();
  
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
  
              return response;
            })
            .catch(error => {
              console.error('Fetch error:', error);
              // Provide a fallback response or handle the error
              return new Response('Offline fallback response', { status: 500 });
            });
        })
    );
  });
  