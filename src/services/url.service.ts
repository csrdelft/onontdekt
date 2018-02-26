import { Injectable } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { SafariViewController } from '@ionic-native/safari-view-controller';
import { Platform } from 'ionic-angular';

import { AppConfig } from '../app/app.config';

@Injectable()
export class UrlService {
  constructor(
    private inAppBrowser: InAppBrowser,
    private photoViewer: PhotoViewer,
    private platform: Platform,
    private safariViewController: SafariViewController
  ) {}

  open(url: string) {
    if (this.platform.is('cordova')) {
      const ext = url.substr(-4);
      const hashIndex = url.indexOf('#');
      if ((ext === '.jpg' || ext === '.png') && hashIndex === -1) {
        this.photoViewer.show(url);
      } else if (hashIndex > -1 && url.indexOf('#/plaetjes/') !== -1) {
        url = AppConfig.ENV.siteUrl + url.substr(hashIndex + 1);
        this.photoViewer.show(url);
      } else if (this.platform.is('ios')) {
        this.safariViewController.isAvailable().then(available => {
          if (available) {
            this.safariViewController
              .show({ url, tintColor: '#0a3292' })
              .subscribe();
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

  getMapsUrl(query: string): string {
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
