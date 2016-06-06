import { Injectable } from '@angular/core';
import { Analytics, Deploy, IonicPlatform, Push } from 'ionic-platform-web-client';


@Injectable()
export class IonicPlatformService {
  private analytics: Analytics;
  private deploy: Deploy;
  private push: Push;

  constructor() {
    IonicPlatform.init({
      app_id: 'b4141034',
      gcm_key: '335763697269',
      api_key: '97027c1764e631ed4daccfd8c909e49dfbd1fbbd3e93d728',
      dev_push: false
    });

    this.analytics = new Analytics();
    this.deploy = new Deploy();
    this.push = new Push();
  }

  public deployUpdate() {
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
