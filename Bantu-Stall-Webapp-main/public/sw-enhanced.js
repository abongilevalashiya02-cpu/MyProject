// Enhanced Service Worker with Background Sync and Push Notifications
const CACHE_NAME = 'bantu-stall-v2';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';

// Enhanced caching strategy
const CACHE_STRATEGIES = {
  static: [
    '/',
    '/static/js/bundle.js',
    '/static/css/main.css',
    '/manifest.json'
  ],
  images: /\.(png|jpg|jpeg|svg|gif|webp|avif)$/,
  api: /\/api\//,
  fonts: /\.(woff|woff2|ttf|eot)$/
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(CACHE_STRATEGIES.static);
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

// Enhanced fetch handler with multiple strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Network first for API calls
  if (CACHE_STRATEGIES.api.test(url.pathname)) {
    event.respondWith(networkFirst(request));
  }
  // Cache first for static assets
  else if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(cacheFirst(request));
  }
  // Stale while revalidate for images
  else if (CACHE_STRATEGIES.images.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request));
  }
  // Network first with fallback for everything else
  else {
    event.respondWith(networkFirstWithFallback(request));
  }
});

// Caching strategies
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });

  return cachedResponse || fetchPromise;
}

async function networkFirstWithFallback(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline fallback page
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncOfflineActions());
  }
});

async function syncOfflineActions() {
  // Sync offline data when connection is restored
  const offlineActions = await getOfflineActions();
  for (const action of offlineActions) {
    try {
      await processOfflineAction(action);
      await removeOfflineAction(action.id);
    } catch (error) {
      console.error('Failed to sync offline action:', error);
    }
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/bantu-stall-logo.png',
      badge: '/favicon.ico',
      vibrate: [100, 50, 100],
      data: data.data,
      actions: [
        {
          action: 'view',
          title: 'View',
          icon: '/icons/view.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/icons/dismiss.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// Utility functions for offline storage
async function getOfflineActions() {
  // Implementation for retrieving offline actions from IndexedDB
  return [];
}

async function processOfflineAction(action) {
  // Implementation for processing offline actions
}

async function removeOfflineAction(actionId) {
  // Implementation for removing processed offline actions
}
