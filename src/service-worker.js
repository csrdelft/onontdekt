importScripts('./build/workbox-sw.prod.v1.0.0.js');

const workboxSW = new WorkboxSW({ clientsClaim: true });

/**
 * This array will be populated by workboxBuild.injectManifest() when the
 * production service worker is generated.
 */
workboxSW.precache([]);

workboxSW.router.registerRoute(
  'https://csrdelft.nl/API/2.0/(.*)',
  workboxSW.strategies.networkFirst()
);

workboxSW.router.registerRoute(
  'https://csrdelft.nl/plaetjes/pasfoto/(.*)',
  workboxSW.strategies.cacheFirst({
    cacheName: 'pasfotos',
    cacheExpiration: {
      maxAgeSeconds: 28 * 24 * 60 * 60,
    },
    cacheableResponse: { statuses: [0, 200] },
  })
);
