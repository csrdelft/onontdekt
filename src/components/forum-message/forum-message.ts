import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ForumTextPage } from '../../pages/forum-text/forum-text';
import { MemberDetailPage } from '../../pages/member-detail/member-detail';
import { UrlService } from '../../services/url/url';
import { isNumeric } from '../../util/data';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'csr-forum-message',
  templateUrl: 'forum-message.html'
})
export class ForumMessageComponent {
  @Input() text: string;

  constructor(
    private navCtrl: NavController,
    private urlService: UrlService
  ) {}

  checkAnchorClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target || target.nodeName !== 'A') {
      return;
    }

    const url = target.getAttribute('href');
    if (!url || url.length === 0) {
      return;
    }

    if (url.substr(0, 12) === '#/leden/lid/') {
      const id = url.substr(12);
      if (!id || id.length !== 4 || !isNumeric(id)) {
        return;
      }

      event.preventDefault();
      this.navCtrl.push(MemberDetailPage, { id });
    }

    if (url.substr(0, 13) === '#/verklapper/') {
      if (!target.dataset || !target.dataset.text) {
        return;
      }
      const text = decodeURIComponent(target.dataset.text !);

      event.preventDefault();
      this.navCtrl.push(ForumTextPage, { text });
    }

    if (url.substr(0, 8) === 'https://' || url.substr(0, 7) === 'http://') {
      event.preventDefault();
      this.urlService.open(url);
    }
  }
}
