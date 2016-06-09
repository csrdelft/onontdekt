import { provide } from '@angular/core';
import { Http } from '@angular/http';
import { ionicBootstrap } from 'ionic-angular';
import { AuthConfig, AuthHttp } from 'angular2-jwt';
import { providers as ionicPlatformProviders } from '@ionic/platform-client-angular';

import { LustrumApp } from './app';
import { ApiData } from './services/api-data';
import { AuthService } from './services/auth';
import { NotificationService } from './services/notification';


let ionicPlatformConfig = {
  core: {
    app_id: 'b4141034',
    gcm_key: '335763697269',
    api_key: '97027c1764e631ed4daccfd8c909e49dfbd1fbbd3e93d728',
    dev_push: false
  },
  push: {
    debug: true,
    deferInit: true,
    pluginConfig: {
      android: {
        'iconColor': '#1f5370'
      },
      ios: {
        'alert': true,
        'badge': true,
        'sound': true,
        'clearBadge': true
      }
    }
  }
};

let ionicConfig = {
  prodMode: true,
  tabbarLayout: 'title-hide',
  platforms: {
    ios: {
      backButtonText: '',
      statusbarPadding: true // Fixes Ionic View https://github.com/driftyco/ionic-view-issues/issues/164
    }
  }
};

let jwtProvider = provide(AuthHttp, {
  useFactory: (http) => {
    return new AuthHttp(new AuthConfig({
      headerName: 'X-Csr-Authorization'
    }), http);
  },
  deps: [Http]
});

let providers = [
  ApiData,
  AuthService,
  NotificationService,
  jwtProvider
];

providers.push(...ionicPlatformProviders(ionicPlatformConfig));

ionicBootstrap(LustrumApp, providers, ionicConfig);
