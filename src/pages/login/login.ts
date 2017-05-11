import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController } from 'ionic-angular';

import { AuthService } from '../../services/auth/auth';
import { TabsPage } from '../tabs/tabs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'csr-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    const loading = this.loadingCtrl.create({
      content: 'Inloggen...'
    });

    loading.present();

    this.authService
      .login(this.loginForm.value['username'], this.loginForm.value['password'])
      .then(() => {
        this.navCtrl.push(TabsPage).then(() => {
          loading.dismiss();
        });
      })
      .catch(error => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Inloggen mislukt',
          message: 'Pff, die verplicht ingewikkelde wachtwoorden ook... \
            Het kan zijn dat je even moet wachten voor je een nieuwe poging mag wagen.',
          buttons: ['Probeer het nog eens']
        });
        alert.present();
      });
  }
}
