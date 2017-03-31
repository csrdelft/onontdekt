import { Component } from '@angular/core';
import { Events, LoadingController } from 'ionic-angular';
import { GoogleAnalytics } from 'ionic-native';

import { AuthService } from '../../services/auth';


@Component({
  templateUrl: 'about.html'
})
export class AboutPage {
  constructor(
    private events: Events,
    private authService: AuthService,
    private loadingCtrl: LoadingController
  ) {}

  public logout() {
    let loading = this.loadingCtrl.create({
      content: 'Uitloggen...'
    });
    loading.present();

    setTimeout(() => {
      this.authService.logout();
      this.events.publish('user:logout');
      setTimeout(() => {
        loading.dismiss();
      }, 1000);
    }, 1000);
  }

  ionViewDidEnter() {
    if (GoogleAnalytics['installed']()) {
      GoogleAnalytics.trackView('About');
    }
  }

}
