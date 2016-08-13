import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { GoogleAnalytics } from 'ionic-native';

import { SystemBrowserDirective } from '../../directives/system-browser';
import { AuthService } from '../../services/auth';
import { TutorialPage } from '../tutorial/tutorial';


@Component({
  templateUrl: 'build/pages/about/about.html',
  directives: [SystemBrowserDirective]
})
export class AboutPage {
  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController
  ) {}

  public logout() {
    let loading = this.loadingCtrl.create({
      content: 'Uitloggen...'
    });
    loading.present();

    setTimeout(() => {
      this.authService.logout();
      this.navCtrl.parent.setRoot(TutorialPage).then(() => {
        loading.dismiss();
      });
    }, 1000);
  }

  ionViewDidEnter() {
    GoogleAnalytics.trackView('About');
  }

}
