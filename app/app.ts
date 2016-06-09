import { ApplicationRef, Component, Type, ViewChild } from '@angular/core';
import { Nav, Platform, Loading } from 'ionic-angular';
import { Keyboard, Splashscreen } from 'ionic-native';
import { Deploy } from '@ionic/platform-client-angular';

import { AuthService } from './services/auth';
import { NotificationService } from './services/notification';
import { TabsPage } from './pages/tabs/tabs';
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
    private notifier: NotificationService,
    private deploy: Deploy,
    appRef: ApplicationRef
  ) {
    this.initializeCordova();
    this.initializeRootPage();

    setInterval(() => {
      appRef.tick();
    }, 200);
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
