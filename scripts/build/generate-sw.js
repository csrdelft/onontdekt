const workboxBuild = require('workbox-build');

workboxBuild
  .injectManifest({
    swSrc: 'src/service-worker.js',
    swDest: 'www/service-worker.js',
    globDirectory: 'www',
    staticFileGlobs: ['**/*.js', '**/*.css', '**/*.html', '**/*.json'],
    globIgnores: ['**/service-worker.js'],
    modifyUrlPrefix: {
      '/': ''
    }
  })
  .then(() => {
    console.log('The production service worker has been generated.');
  });
