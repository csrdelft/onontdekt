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
    app_id: 'b4141034'
  },
  push: {
    debug: true,
    sender_id: '335763697269',
    pluginConfig: {
      android: {
        'iconColor': '#1f5370',
        'clearBadge': true
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
