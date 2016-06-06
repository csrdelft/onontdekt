import { Injectable } from '@angular/core';
import { App, Toast } from 'ionic-angular';


@Injectable()
export class NotificationService {
  constructor(
    private app: App
  ) {}

  public notify(message: string) {
    let toast = Toast.create({
      message: message,
      duration: 3000
    });
    this.app.getActiveNav().present(toast);
  }

}
