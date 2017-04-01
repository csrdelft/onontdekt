/**
 * Config for Ionic Framework
 * https://ionicframework.com/docs/api/config/Config/
 */

export const ionicConfig = {
  preloadModules: true,
  tabbarLayout: 'title-hide',
  platforms: {
    android: {
      tabsPlacement: 'top',
      tabsHideOnSubPages: true,
      tabsHighlight: true
    },
    ios: {
      backButtonText: ''
    }
  }
};
