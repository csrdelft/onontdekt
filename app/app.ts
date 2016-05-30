import { Type, ViewChild } from '@angular/core';
import { AUTH_PROVIDERS } from 'angular2-jwt';
import { App, Nav, Platform } from 'ionic-angular';
import { Keyboard } from 'ionic-native';

import { AuthService } from './services/auth';
import { NotificationService } from './services/notification';
import { ApiData } from './services/api-data';
import { TabsPage } from './pages/tabs/tabs';
import { LoginPage } from './pages/login/login';
import { TutorialPage } from './pages/tutorial/tutorial';


@App({
  templateUrl: 'build/app.html',
  providers: [
    ApiData,
    AuthService,
    NotificationService,
    AUTH_PROVIDERS
  ],
  config: {
    tabbarLayout: 'title-hide',
    platforms: {
      ios: {
        backButtonText: ''
      }
    }
  }
})
export class LustrumApp {
  @ViewChild(Nav) private nav: Nav;

  rootPage: Type;

  constructor(
    platform: Platform,
    authService: AuthService
  ) {
    platform.ready().then(() => {
      Keyboard.disableScroll(true);
    });

    authService.tryAuthentication().then(authenticated => {
      this.rootPage = authenticated ? TabsPage : TutorialPage;
    });
  }
}
