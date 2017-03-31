import { Component, ViewChild } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Keyboard } from '@ionic-native/keyboard';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Events, Nav, Platform, LoadingController } from 'ionic-angular';
import { Deploy } from '@ionic/cloud-angular';
import moment from 'moment';
import 'moment/locale/nl';

import { AuthService } from '../services/auth';
import { NotificationService } from '../services/notification';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';


@Component({
  templateUrl: 'app.component.html'
})
export class LustrumApp {
  @ViewChild(Nav) nav: Nav;

  constructor(
    private events: Events,
    private platform: Platform,
    private authService: AuthService,
    private notifier: NotificationService,
    private deploy: Deploy,
    private loadingCtrl: LoadingController,
    private googleAnalytics: GoogleAnalytics,
    private keyboard: Keyboard,
    private splashScreen: SplashScreen
  ) {
    this.initializeRootPage();
    this.listenToLogoutEvent();
    if (this.platform.is('cordova')) {
      this.initializeCordova();
    }
    moment.locale('nl');
  }

  private initializeCordova() {
    this.platform.ready().then(() => {
      this.runDeploy();
      this.keyboard.disableScroll(true);
      this.googleAnalytics.startTrackerWithId('UA-79997582-1');
      this.googleAnalytics.enableUncaughtExceptionReporting(true);
    });
  }

  private initializeRootPage() {
    this.authService.tryAuthentication().then((authenticated: boolean) => {
      let pageToLoad = authenticated ? TabsPage : TutorialPage;
      this.nav.setRoot(pageToLoad);
      if (this.platform.is('cordova')) {
        this.platform.ready().then(() => {
          setTimeout(() => this.splashScreen.hide(), 400);
        });
      }
    });
  }

  private runDeploy() {
    this.deploy.check().then((result: boolean) => {
      if (result === true) {
        let loading = this.loadingCtrl.create({
          content: 'Update installeren...'
        });
        loading.present();
        this.splashScreen.hide();
        this.deploy.download().then(() => {
          this.deploy.extract().then(() => {
            this.splashScreen.show();
            this.deploy.load();
          }, (error: string) => {
            loading.dismiss();
            let message = 'Update installeren mislukt: ' + error;
            this.notifier.notify(message);
          });
        }, (error: string) => {
          loading.dismiss();
          let message = 'Update downloaden mislukt: ' + error;
          this.notifier.notify(message);
        });
      } else {
        this.splashScreen.hide();
      }
    }, (error: string) => {
      let message = 'Update mislukt: ' + error;
      this.notifier.notify(message);
      this.splashScreen.hide();
    });
  }

  private listenToLogoutEvent() {
    this.events.subscribe('user:logout', () => {
      this.nav.setRoot(TutorialPage);
    });
  }
}
