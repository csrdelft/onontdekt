// this is a custom dictionary to make it easy to extend/override
// provide a name for an entry, it can be anything such as 'copyAssets' or 'copyFonts'
// then provide an object with a `src` array of globs and a `dest` string
module.exports = {
  copyIndexContent: {
    src: ['{{SRC}}/index.html', '{{SRC}}/manifest.json'],
    dest: '{{WWW}}'
  },
  copyFonts: {
    src: [
      '{{ROOT}}/node_modules/ionicons/dist/fonts/ionicons.woff',
      '{{ROOT}}/node_modules/ionicons/dist/fonts/ionicons.woff2',
      '{{ROOT}}/node_modules/ionic-angular/fonts/roboto-bold.woff',
      '{{ROOT}}/node_modules/ionic-angular/fonts/roboto-bold.woff2',
      '{{ROOT}}/node_modules/ionic-angular/fonts/roboto-light.woff',
      '{{ROOT}}/node_modules/ionic-angular/fonts/roboto-light.woff2',
      '{{ROOT}}/node_modules/ionic-angular/fonts/roboto-medium.woff',
      '{{ROOT}}/node_modules/ionic-angular/fonts/roboto-medium.woff2',
      '{{ROOT}}/node_modules/ionic-angular/fonts/roboto-regular.woff',
      '{{ROOT}}/node_modules/ionic-angular/fonts/roboto-regular.woff2'
    ],
    dest: '{{WWW}}/assets/fonts'
  },
  copySwToolbox: {
    src: [
      '{{ROOT}}/node_modules/workbox-sw/build/importScripts/workbox-sw.prod.v2.1.2.js'
    ],
    dest: '{{BUILD}}'
  }
};
