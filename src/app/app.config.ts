import { isDevMode } from '@angular/core';

/**
 * Environment config
 */
export class AppConfig {
  static get IS_DEV(): boolean {
    return isDevMode();
  }

  static get SITE_URL(): string {
    return 'https://csrdelft.nl';
  }

  static get API_ENDPOINT(): string {
    return isDevMode() ? '/api-proxy' : 'https://csrdelft.nl/API/2.0';
  }
}

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
