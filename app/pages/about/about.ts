import { Component } from '@angular/core';
import { Loading, NavController } from 'ionic-angular';

import { SystemBrowser } from '../../directives/system-browser';
import { AuthService } from '../../services/auth';
import { TutorialPage } from '../tutorial/tutorial';


@Component({
  templateUrl: 'build/pages/about/about.html',
  directives: [SystemBrowser]
})
export class AboutPage {
  constructor(
    private authService: AuthService,
    private nav: NavController
  ) {}

  logout() {
    let loading = Loading.create({
      content: 'Uitloggen...'
    });
    this.nav.present(loading);

    setTimeout(() => {
      this.authService.logout();
      this.nav.rootNav.setRoot(TutorialPage).then(() => {
        loading.dismiss();
      });
    }, 1000);
  }

}
