// Service Worker for ESPHome YAML Wizard PWA
const CACHE_VERSION = 'esphome-wizard-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

// Files to cache for offline use
const STATIC_FILES = [
    '/',
    '/index.html',
    '/index.css',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...', event);
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            console.log('[SW] Precaching static files');
            return cache.addAll(STATIC_FILES).catch(err => {
                console.warn('[SW] Some files failed to cache:', err);
                // Continue even if some files fail
            });
        }).then(() => {
            return self.skipWaiting();
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...', event);
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== STATIC_CACHE && cache !== DYNAMIC_CACHE) {
                        console.log('[SW] Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        // For CDN resources (Tailwind, React, etc.), try network first
        event.respondWith(
            fetch(request).catch(() => {
                // If network fails, app will handle gracefully
                return new Response('Network error', { status: 503 });
            })
        );
        return;
    }

    // For same-origin requests, use cache-first strategy for static assets
    if (request.method === 'GET') {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                // If not in cache, fetch from network
                return fetch(request).then((networkResponse) => {
                    // Clone the response
                    const responseToCache = networkResponse.clone();

                    // Cache the new response for future use (only for successful responses)
                    if (networkResponse.status === 200) {
                        caches.open(DYNAMIC_CACHE).then((cache) => {
                            cache.put(request, responseToCache);
                        });
                    }

                    return networkResponse;
                }).catch((error) => {
                    console.error('[SW] Fetch failed:', error);

                    // Return offline page or error response
                    return new Response(
                        `<!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Offline - ESPHome Wizard</title>
              <style>
                body {
                  font-family: system-ui, -apple-system, sans-serif;
                  background: #1a1b26;
                  color: #a9b1d6;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  height: 100vh;
                  margin: 0;
                  text-align: center;
                  padding: 20px;
                }
                .container {
                  max-width: 400px;
                }
                h1 {
                  color: #88C0D0;
                  margin-bottom: 1rem;
                }
                p {
                  margin-bottom: 1.5rem;
                }
                button {
                  background: #88C0D0;
                  color: #1a1b26;
                  border: none;
                  padding: 10px 20px;
                  border-radius: 6px;
                  cursor: pointer;
                  font-size: 16px;
                }
                button:hover {
                  background: #9fd5de;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>You're Offline</h1>
                <p>It looks like you're not connected to the internet. Some features may be limited.</p>
                <button onclick="window.location.reload()">Try Again</button>
              </div>
            </body>
            </html>`,
                        {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({
                                'Content-Type': 'text/html'
                            })
                        }
                    );
                });
            })
        );
    }
});

// Handle messages from clients
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
