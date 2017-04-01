import { Component } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Events, IonicPage, LoadingController } from 'ionic-angular';

import { AuthService } from '../../providers/auth';

@IonicPage()
@Component({
  selector: 'about-page',
  templateUrl: 'about.html'
})
export class AboutPage {
  constructor(
    private events: Events,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private googleAnalytics: GoogleAnalytics
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
    if ((GoogleAnalytics as any)['installed']()) {
      this.googleAnalytics.trackView('About');
    }
  }

}
