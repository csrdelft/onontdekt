import { Component, Type, ViewChild } from '@angular/core';
import { Nav, Platform, Loading } from 'ionic-angular';
import { Keyboard, Splashscreen, StatusBar } from 'ionic-native';
import { Deploy } from '@ionic/cloud-angular';

import { AuthService } from './services/auth';
import { NotificationService } from './services/notification';
import { TabsPage } from './pages/tabs/tabs';
import { TutorialPage } from './pages/tutorial/tutorial';


@Component({
  templateUrl: 'build/app.html'
})
export class LustrumApp {
  @ViewChild(Nav) private nav: Nav;

  constructor(
    private platform: Platform,
    private authService: AuthService,
    private notifier: NotificationService,
    private deploy: Deploy
  ) {
    this.initializeRootPage();
    if (this.platform.is('cordova')) {
      this.initializeCordova();
    }
  }

  private initializeCordova() {
    this.platform.ready().then(() => {
      Keyboard.disableScroll(true);
      this.runDeploy();
    });
  }

  private initializeRootPage() {
    this.authService.tryAuthentication().then((authenticated: boolean) => {
      let pageToLoad = authenticated ? TabsPage : TutorialPage;
      this.nav.setRoot(pageToLoad);
      this.platform.ready().then(() => {
        if (authenticated) {
          StatusBar.styleLightContent();
        } else {
          StatusBar.styleDefault();
        }
        setTimeout(() => {
          Splashscreen.hide();
        }, 400);
      });
    });
  }

  private runDeploy() {
    this.deploy.check().then((result: boolean) => {
      if (result === true) {
        let loading = Loading.create({
          content: 'Update installeren...'
        });
        this.nav.present(loading);
        Splashscreen.hide();
        this.deploy.update(false).then((result: boolean) => {
          if (result) {
            Splashscreen.show();
          }
          loading.dismiss();
        }, (error: string) => {
          loading.dismiss();
          let message = 'Update installeren mislukt: ' + error;
          this.notifier.notify(message);
        });
      } else {
        Splashscreen.hide();
      }
    }, (error: string) => {
      let message = 'Update mislukt: ' + error;
      this.notifier.notify(message);
      Splashscreen.hide();
    });
  }
}
