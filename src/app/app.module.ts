import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { AuthModule, AuthConfig } from 'angular2-jwt';
import { MomentModule } from 'angular2-moment';
import { IonicStorageModule } from '@ionic/storage';

import { LustrumApp } from './app.component';

import { MapsHrefDirective } from '../directives/maps-href';
import { SystemBrowserDirective } from '../directives/system-browser';

import { AboutPage } from '../pages/about/about';
import { EventDetailPage } from '../pages/event-detail/event-detail';
import { EventListPage } from '../pages/event-list/event-list';
import { ForumRecentPage } from '../pages/forum-recent/forum-recent';
import { ForumTopicPage } from '../pages/forum-topic/forum-topic';
import { LoginPage } from '../pages/login/login';
import { MemberDetailPage } from '../pages/member-detail/member-detail';
import { MemberListPage } from '../pages/member-list/member-list';
import { RankingPage } from '../pages/ranking/ranking';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';

import { BBCodePipe } from '../pipes/bb-code';
import { StripBBPipe } from '../pipes/strip-bb';

import { ApiData } from '../services/api-data';
import { AuthService } from '../services/auth';
import { BBParseService } from '../services/bb-parse';
import { NotificationService } from '../services/notification';

const pages = [
  AboutPage,
  EventDetailPage,
  EventListPage,
  ForumRecentPage,
  ForumTopicPage,
  LoginPage,
  MemberDetailPage,
  MemberListPage,
  RankingPage,
  TabsPage,
  TutorialPage
];

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

@NgModule({
  declarations: [
    LustrumApp,
    pages,
    MapsHrefDirective,
    SystemBrowserDirective,
    BBCodePipe,
    StripBBPipe
  ],
  imports: [
    AuthModule.forRoot(new AuthConfig({
      headerName: 'X-Csr-Authorization'
    })),
    CloudModule.forRoot(cloudSettings),
    IonicModule.forRoot(LustrumApp, ionicConfig),
    IonicStorageModule.forRoot(),
    MomentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    LustrumApp,
    pages
  ],
  providers: [
    ApiData,
    AuthService,
    BBParseService,
    NotificationService
  ]
})
export class AppModule {}
