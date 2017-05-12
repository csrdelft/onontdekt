import { Component, ViewChild } from '@angular/core';
import { CodePush, SyncStatus } from '@ionic-native/code-push';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Keyboard } from '@ionic-native/keyboard';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Events, Nav, Platform, ToastController } from 'ionic-angular';

import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { AuthService } from '../services/auth/auth';

@Component({
  templateUrl: 'app.component.html'
})
export class LustrumApp {
  @ViewChild(Nav) nav: Nav;

  constructor(
    private events: Events,
    private platform: Platform,
    private authService: AuthService,
    private codePush: CodePush,
    private toastCtrl: ToastController,
    private googleAnalytics: GoogleAnalytics,
    private keyboard: Keyboard,
    private splashScreen: SplashScreen
  ) {
    this.initializeRootPage();
    this.listenToLogoutEvent();
    if (this.platform.is('cordova')) {
      this.initializeCordova();
    }
  }

  private initializeCordova() {
    this.platform.ready().then(() => {
      this.runUpdate();
      this.keyboard.disableScroll(true);
      this.googleAnalytics.startTrackerWithId('UA-79997582-1');
      this.googleAnalytics.enableUncaughtExceptionReporting(true);
    });
  }

  private initializeRootPage() {
    this.authService.tryAuthentication().then((authenticated: boolean) => {
      const pageToLoad = authenticated ? TabsPage : TutorialPage;
      this.nav.setRoot(pageToLoad);
      if (this.platform.is('cordova')) {
        this.platform.ready().then(() => {
          setTimeout(() => this.splashScreen.hide(), 400);
        });
      }
    });
  }

  private runUpdate() {
    this.codePush.sync().subscribe(status => {
      switch (status) {
        case SyncStatus.INSTALLING_UPDATE:
          this.toastCtrl.create({
            message: 'Er is een update beschikbaar. Herstart de app om deze direct te gebruiken.',
            duration: 6000
          }).present();
          break;
      }
    });
  }

  private listenToLogoutEvent() {
    this.events.subscribe('user:logout', () => {
      this.nav.setRoot(TutorialPage);
    });
  }
}
