import { enableProdMode, provide, Type, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { AuthConfig, AuthHttp } from 'angular2-jwt';
import { App, Nav, Platform } from 'ionic-angular';
import { Keyboard } from 'ionic-native';
// import { Deploy } from 'ionic-platform-web-client';

import { AuthService } from './services/auth';
import { NotificationService } from './services/notification';
import { ApiData } from './services/api-data';
import { TabsPage } from './pages/tabs/tabs';
import { LoginPage } from './pages/login/login';
import { TutorialPage } from './pages/tutorial/tutorial';


enableProdMode();

@App({
  templateUrl: 'build/app.html',
  providers: [
    ApiData,
    AuthService,
    NotificationService,
    // Deploy,
    // Push,
    provide(AuthHttp, {
      useFactory: (http) => {
        return new AuthHttp(new AuthConfig({
          headerName: 'X-Csr-Authorization'
        }), http);
      },
      deps: [Http]
    })
  ],
  config: {
    tabbarLayout: 'title-hide',
    scrollAssist: false, // Fixes some beta keyboard issues
    autoFocusAssist: false, // Fixes some beta keyboard issues
    platforms: {
      ios: {
        backButtonText: '',
        statusbarPadding: true // Fixes Ionic View https://github.com/driftyco/ionic-view-issues/issues/164
      }
    }
  }
})
export class LustrumApp {
  @ViewChild(Nav) private nav: Nav;

  rootPage: Type;

  constructor(
    private platform: Platform,
    // private deploy: Deploy,
    // private notifier: NotificationService,
    private authService: AuthService
  ) {
    this.initializeCordova();
    this.initializeRootPage();
  }

  private initializeCordova(): void {
    this.platform.ready().then(() => {
      Keyboard.disableScroll(true);
      this.deployUpdate();
    });
  }

  private initializeRootPage(): void {
    this.authService.tryAuthentication().then(authenticated => {
      let pageToLoad = authenticated ? TabsPage : TutorialPage;
      this.nav.setRoot(pageToLoad);
    });
  }

  private deployUpdate(): void {
    // this.deploy.update(false).then((result: boolean) => {
    //   let message = result ? 'Update geïnstalleerd!' : 'Geen update beschikbaar.';
    //   this.notifier.notify(message);
    // }, (error: string) => {
    //   let message = 'Fout bij updaten: ' + error;
    //   this.notifier.notify(message);
    // });
  }
}
