import { Injectable } from '@angular/core';
import { App, ToastController } from 'ionic-angular';


@Injectable()
export class NotificationService {
  constructor(
    private app: App,
    private toastCtrl: ToastController
  ) {}

  public notify(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

}
