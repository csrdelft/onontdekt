import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';

import { AppConfig } from '../../app/app.config';
import { ForumTextPage } from '../../pages/forum-text/forum-text';
import { MemberDetailPage } from '../../pages/member-detail/member-detail';
import { UrlService } from '../../services/url.service';
import { isNumeric } from '../../util/data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'csr-forum-message',
  templateUrl: 'forum-message.html'
})
export class ForumMessageComponent {
  @Input() text: string;

  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private urlService: UrlService
  ) {}

  checkAnchorClick(event: MouseEvent) {
    let target = event.target as HTMLElement;
    if (!target || target.nodeName !== 'A') {
      const parent = target.closest('a');
      if (!parent) {
        return;
      } else {
        target = parent as HTMLElement;
      }
    }

    let url = target.getAttribute('href');
    if (!url || url.length === 0) {
      return;
    }

    if (url.substr(0, 9) === '/profiel/') {
      const id = url.substr(9);
      if (!id || id.length !== 4 || !isNumeric(id)) {
        return event.preventDefault();
      }

      this.navCtrl.push(MemberDetailPage, { id });
      return event.preventDefault();
    }

    if (url.substr(0, 13) === '#/verklapper/') {
      const text = decodeURIComponent(url.substr(13).replace(/\+/g, ' '));
      if (!text) {
        return event.preventDefault();
      }

      this.navCtrl.push(ForumTextPage, { text });
      return event.preventDefault();
    }

    if (
      url.substr(0, 10) === '#/peiling/' ||
      url.substr(0, 12) === '#/slideshow/'
    ) {
      this.alertCtrl
        .create()
        .setMessage(
          'Deze link wordt niet ondersteund. Bekijk het draadje op de stek!'
        )
        .addButton('Ok')
        .present();
      return event.preventDefault();
    }

    if (url.substr(0, 1) === '/') {
      url = AppConfig.ENV.siteUrl + url;
    }

    if (url.substr(0, 8) === 'https://' || url.substr(0, 7) === 'http://') {
      this.urlService.open(url);
      return event.preventDefault();
    }
  }
}
