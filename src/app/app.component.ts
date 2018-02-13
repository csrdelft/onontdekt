import { Component, ViewChild } from '@angular/core';
import { CodePush, SyncStatus } from '@ionic-native/code-push';
import { Keyboard } from '@ionic-native/keyboard';
import { SplashScreen } from '@ionic-native/splash-screen';
import { select, Store } from '@ngrx/store';
import { Nav, Platform, ToastController } from 'ionic-angular';
import { first } from 'rxjs/operators';

import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import * as fromRoot from '../state';

@Component({
  templateUrl: 'app.component.html'
})
export class CSRApp {
  @ViewChild(Nav) nav: Nav;

  constructor(
    private platform: Platform,
    private codePush: CodePush,
    private toastCtrl: ToastController,
    private keyboard: Keyboard,
    private splashScreen: SplashScreen,
    private store: Store<fromRoot.State>
  ) {
    this.initializeRootPage();
    if (this.platform.is('cordova')) {
      this.initializeCordova();
    }
  }

  private initializeCordova() {
    this.platform.ready().then(() => {
      this.runUpdate();
      this.keyboard.disableScroll(true);
    });
  }

  private initializeRootPage() {
    this.store.pipe(
      select(fromRoot.getAuthenticated),
      first(authed => authed !== undefined)
    ).subscribe(authenticated => {
      const pageToLoad = authenticated ? TabsPage : LoginPage;
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
}
