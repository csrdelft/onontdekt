import { NgModule } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { IonicApp, IonicModule } from 'ionic-angular';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { Storage } from '@ionic/storage';

import { LustrumApp } from './app.component';

import { MapsHrefDirective } from '../directives/maps-href';
import { SystemBrowserDirective } from '../directives/system-browser';

import { AboutPage } from '../pages/about/about';
import { EventDetailPage } from '../pages/event-detail/event-detail';
import { EventListPage } from '../pages/event-list/event-list';
import { GotchaPage } from '../pages/gotcha/gotcha';
import { LoginPage } from '../pages/login/login';
import { MemberDetailPage } from '../pages/member-detail/member-detail';
import { MemberListPage } from '../pages/member-list/member-list';
import { RankingPage } from '../pages/ranking/ranking';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';

import { ApiData } from '../services/api-data';
import { AuthService } from '../services/auth';
import { NotificationService } from '../services/notification';


const ionicConfig = {
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

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'b4141034'
  },
  'push': {
    'sender_id': '335763697269',
    'pluginConfig': {
      'android': {
        'iconColor': '#1f5370',
        'clearBadge': true
      },
      'ios': {
        'alert': true,
        'badge': true,
        'sound': true,
        'clearBadge': true
      }
    }
  }
};

export function authFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    headerName: 'X-Csr-Authorization'
  }), http, options);
}

export const authProvider = {
  provide: AuthHttp,
  deps: [Http, RequestOptions],
  useFactory: authFactory
};

@NgModule({
  declarations: [
    LustrumApp,
    AboutPage,
    EventDetailPage,
    EventListPage,
    GotchaPage,
    LoginPage,
    MemberDetailPage,
    MemberListPage,
    RankingPage,
    TabsPage,
    TutorialPage,
    MapsHrefDirective,
    SystemBrowserDirective
  ],
  imports: [
    CloudModule.forRoot(cloudSettings),
    IonicModule.forRoot(LustrumApp, ionicConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    LustrumApp,
    AboutPage,
    EventDetailPage,
    EventListPage,
    GotchaPage,
    LoginPage,
    MemberDetailPage,
    MemberListPage,
    RankingPage,
    TabsPage,
    TutorialPage
  ],
  providers: [
    ApiData,
    AuthService,
    NotificationService,
    authProvider,
    Storage
  ]
})
export class AppModule {}
