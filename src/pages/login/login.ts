import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController } from 'ionic-angular';

import { AuthService } from '../../services/auth';
import { TabsPage } from '../tabs/tabs';


@Component({
  templateUrl: 'login.html'
})
export class LoginPage {
  login: {
    username?: string;
    password?: string;
  } = {};
  submitted: boolean = false;

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  onLogin(form) {
    this.submitted = true;

    if (form.valid) {
      let loading = this.loadingCtrl.create({
        content: 'Inloggen...'
      });

      loading.present();

      this.authService
        .login(this.login.username, this.login.password)
        .then(() => {
          this.navCtrl.push(TabsPage).then(() => {
            loading.dismiss();
          });
        })
        .catch(error => {
          console.log(error);
          loading.dismiss();
          let alert = this.alertCtrl.create({
            title: 'Inloggen mislukt',
            message: 'Pff, die verplicht ingewikkelde wachtwoorden ook... Het kan zijn dat je even moet wachten voor je een nieuwe poging mag wagen.',
            buttons: ['Probeer het nog eens']
          });
          alert.present();
        });
    }
  }
}
