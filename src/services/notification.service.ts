import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class NotificationService {
  constructor(private toastCtrl: ToastController) {}

  notify(message: string) {
    const toast = this.toastCtrl.create({
      message,
      duration: 3000
    });
    toast.present();
  }
}
