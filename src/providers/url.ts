import { Injectable } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SafariViewController } from '@ionic-native/safari-view-controller';
import { Platform } from 'ionic-angular';

@Injectable()
export class UrlService {
  constructor(
    private inAppBrowser: InAppBrowser,
    private platform: Platform,
    private safariViewController: SafariViewController
  ) {}

  public open(url: string) {
    if (this.platform.is('cordova')) {
      if (this.platform.is('ios')) {
        this.safariViewController.isAvailable().then(available => {
          if (available) {
            this.safariViewController.show({ url });
          } else {
            this.inAppBrowser.create(url, '_system');
          }
        });
      } else {
        this.inAppBrowser.create(url, '_system');
      }
    } else {
      window.open(url, '_blank');
    }
  }

  public getMapsUrl(query: string): string {
    query = encodeURIComponent(query);

    if (this.platform.is('mobile') === true) {
      if (this.platform.is('ios') === true) {
        return 'maps://maps.apple.com/?q=' + query;
      } else {
        return 'geo:0,0?q=' + query;
      }
    } else {
      return 'https://maps.google.com?q=' + query;
    }
  }

}
