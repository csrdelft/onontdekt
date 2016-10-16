import { Component } from '@angular/core';
import { Events, LoadingController, NavController } from 'ionic-angular';
import { GoogleAnalytics } from 'ionic-native';

import { SystemBrowserDirective } from '../../directives/system-browser';
import { AuthService } from '../../services/auth';
import { TutorialPage } from '../tutorial/tutorial';


@Component({
  templateUrl: 'about.html'
})
export class AboutPage {
  constructor(
    private events: Events,
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
      this.events.publish('user:logout');
      setTimeout(() => {
        loading.dismiss();
      }, 1000);
    }, 1000);
  }

  ionViewDidEnter() {
    GoogleAnalytics.trackView('About');
  }

}
