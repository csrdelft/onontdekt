import { Alert, IonicApp, Loading, NavController, Page } from 'ionic-angular';

import { AuthService } from '../../services/auth';
import { TabsPage } from '../tabs/tabs';


@Page({
  templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {
  login: {
    username?: string;
    password?: string;
  } = {};
  submitted: boolean = false;

  constructor(
    private authService: AuthService,
    private nav: NavController
  ) {}

  onLogin(form) {
    this.submitted = true;

    if (form.valid) {
      let loading = Loading.create({
        content: 'Inloggen...'
      });

      this.nav.present(loading);

      this.authService
        .login(this.login.username, this.login.password)
        .then(() => {
          this.nav.push(TabsPage).then(() => {
            loading.dismiss();
          });
        })
        .catch(error => {
          console.log(error);
          loading.dismiss();
          let alert = Alert.create({
            title: 'Inloggen mislukt',
            message: 'Pff, die verplicht ingewikkelde wachtwoorden ook... Het kan zijn dat je even moet wachten voor je een nieuwe poging mag wagen.',
            buttons: ['Probeer het nog eens']
          });
          this.nav.present(alert);
        });
    }
  }
}
