import { Injectable } from '@angular/core';
import { Analytics, Deploy, Push } from 'ionic-platform-web-client';


@Injectable()
export class IonicPlatformService {
  private analytics: Analytics;
  private deploy: Deploy;
  private push: Push;

  constructor() {
    let pushConfig = {
      deferInit: true,
      debug: true,
      pluginConfig: {
        android: {
          'senderID': '335763697269'
        },
        ios: {
          'alert': true,
          'badge': true,
          'sound': true,
          'clearBadge': true
        }
      }
    };

    this.analytics = new Analytics();
    this.deploy = new Deploy();
    this.push = new Push(pushConfig);
  }

  public checkUpdate() {
    return this.deploy.check();
  }

  public installUpdate() {
    return this.deploy.update(false);
  }

  public pushRegister(userId: string): void {
    // let user = User.current();
    // user.id = userId;
    // user.save();

    this.push.register((token) => {
      this.push.saveToken(token, {});
    });
  }

  public pushUnregister(): void {
    this.push.unregister();
  }
}
