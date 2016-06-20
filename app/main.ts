import { provide } from '@angular/core';
import { Http } from '@angular/http';
import { ionicBootstrap } from 'ionic-angular';
import { AuthConfig, AuthHttp } from 'angular2-jwt';
import { CloudSettings, provideCloud } from '@ionic/cloud-angular';

import { LustrumApp } from './app';
import { ApiData } from './services/api-data';
import { AuthService } from './services/auth';
import { NotificationService } from './services/notification';


const cloudSettings: CloudSettings = {
  core: {
    app_id: 'b4141034',
    gcm_key: '335763697269',
    api_key: '97027c1764e631ed4daccfd8c909e49dfbd1fbbd3e93d728',
    dev_push: false
  },
  push: {
    debug: true,
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

const ionicConfig = {
  prodMode: true,
  tabbarLayout: 'title-hide',
  platforms: {
    ios: {
      backButtonText: ''
    }
  }
};

const jwtProvider = provide(AuthHttp, {
  useFactory: (http) => {
    return new AuthHttp(new AuthConfig({
      headerName: 'X-Csr-Authorization'
    }), http);
  },
  deps: [Http]
});

const providers = [
  ApiData,
  AuthService,
  NotificationService,
  jwtProvider,
  provideCloud(cloudSettings)
];

ionicBootstrap(LustrumApp, providers, ionicConfig);
