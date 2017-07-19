/**
 * Environment config
 *
 * The environments are loaded by webpack from `/config/environments/${ENV}.json`
 */
interface Env {
  env: {
    production: boolean;
    siteUrl: string;
    apiEndpoint: string;
  };
}

declare var webpackGlobalVars: Env;

export class AppConfig {
  static get ENV() {
    return webpackGlobalVars.env;
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
    ios: {
      backButtonText: ''
    }
  }
};
