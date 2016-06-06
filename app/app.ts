import { provide, Component, Type, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { AuthConfig, AuthHttp } from 'angular2-jwt';
import { ionicBootstrap, Nav, Platform } from 'ionic-angular';
import { Keyboard } from 'ionic-native';

import { AuthService } from './services/auth';
import { NotificationService } from './services/notification';
import { ApiData } from './services/api-data';
import { IonicPlatformService } from './services/ionic-platform';
import { TabsPage } from './pages/tabs/tabs';
import { LoginPage } from './pages/login/login';
import { TutorialPage } from './pages/tutorial/tutorial';


@Component({
  templateUrl: 'build/app.html'
})
export class LustrumApp {
  @ViewChild(Nav) private nav: Nav;

  rootPage: Type;

  constructor(
    private platform: Platform,
    private authService: AuthService,
    private ionicPlatform: IonicPlatformService,
    private notifier: NotificationService
  ) {
    this.initializeCordova();
    this.initializeRootPage();
  }

  private initializeCordova(): void {
    this.platform.ready().then(() => {
      Keyboard.disableScroll(true);
      this.runDeploy();
    });
  }

  private initializeRootPage(): void {
    this.authService.tryAuthentication().then(authenticated => {
      let pageToLoad = authenticated ? TabsPage : TutorialPage;
      this.nav.setRoot(pageToLoad);
    });
  }

  private runDeploy(): void {
    this.ionicPlatform.deployUpdate().then((result: boolean) => {
      let message = result ? 'Update geïnstalleerd!' : 'Geen update beschikbaar.';
      this.notifier.notify(message);
    }, (error: string) => {
      let message = 'Fout bij updaten: ' + error;
      this.notifier.notify(message);
    });
  }
}


// Pass the main app component as the first argument
// Pass any providers for your app in the second argument
// Set any config for your app as the third argument:
// http://ionicframework.com/docs/v2/api/config/Config/

ionicBootstrap(LustrumApp, [
  ApiData,
  AuthService,
  NotificationService,
  IonicPlatformService,
  provide(AuthHttp, {
    useFactory: (http) => {
      return new AuthHttp(new AuthConfig({
        headerName: 'X-Csr-Authorization'
      }), http);
    },
    deps: [Http]
  })
], {
  prodMode: true,
  tabbarLayout: 'title-hide',
  scrollAssist: false, // Fixes some beta keyboard issues
  autoFocusAssist: false, // Fixes some beta keyboard issues
  platforms: {
    ios: {
      backButtonText: '',
      statusbarPadding: true // Fixes Ionic View https://github.com/driftyco/ionic-view-issues/issues/164
    }
  }
});
