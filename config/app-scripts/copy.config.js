// this is a custom dictionary to make it easy to extend/override
// provide a name for an entry, it can be anything such as 'copyAssets' or 'copyFonts'
// then provide an object with a `src` array of globs and a `dest` string
module.exports = {
  copyFonts: {
    src: [
      '{{ROOT}}/node_modules/ionicons/dist/fonts/ionicons.woff',
      '{{ROOT}}/node_modules/ionicons/dist/fonts/ionicons.woff2',
      '{{ROOT}}/node_modules/ionic-angular/fonts/ionicons.scss',
      '{{ROOT}}/node_modules/ionic-angular/fonts/roboto-bold.woff',
      '{{ROOT}}/node_modules/ionic-angular/fonts/roboto-bold.woff2',
      '{{ROOT}}/node_modules/ionic-angular/fonts/roboto-light.woff',
      '{{ROOT}}/node_modules/ionic-angular/fonts/roboto-light.woff2',
      '{{ROOT}}/node_modules/ionic-angular/fonts/roboto-medium.woff',
      '{{ROOT}}/node_modules/ionic-angular/fonts/roboto-medium.woff2',
      '{{ROOT}}/node_modules/ionic-angular/fonts/roboto-regular.woff',
      '{{ROOT}}/node_modules/ionic-angular/fonts/roboto-regular.woff2',
      '{{ROOT}}/node_modules/ionic-angular/fonts/roboto.scss'
    ],
    dest: '{{WWW}}/assets/fonts'
  }
}
