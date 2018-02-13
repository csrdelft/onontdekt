import { Component } from '@angular/core';
import isFuture from 'date-fns/is_future';
import isPast from 'date-fns/is_past';
import isSameDay from 'date-fns/is_same_day';
import { NavParams } from 'ionic-angular';

import { AppConfig } from '../../app/app.config';
import { Event } from '../../models/event';
import { ApiService } from '../../services/api.service';
import { NotificationService } from '../../services/notification.service';
import { UrlService } from '../../services/url.service';
import { formatLocale, isFullDay } from '../../util/dates';

@Component({
  selector: 'csr-event-detail',
  templateUrl: 'event-detail.html'
})
export class EventDetailPage {
  event: Event;
  processingAction = false;

  constructor(
    private api: ApiService,
    private notifier: NotificationService,
    private urlService: UrlService,
    navParams: NavParams
  ) {
    this.event = navParams.data;
  }

  getDateTimes(start: Date, end: Date): string {
    let line1: string;
    let line2: string;
    const fullDay = isFullDay(start, end);

    if (isSameDay(start, end)) {
      line1 = formatLocale(start, 'dddd D MMMM YYYY').toLowerCase();
      line2 = fullDay
        ? 'Hele dag'
        : formatLocale(start, '[van] HH:mm [tot] ') +
          formatLocale(end, 'HH:mm');
    } else {
      const multipleFormat = fullDay
        ? 'dddd D MMM YYYY'
        : 'HH:mm [op] dd D MMM YYYY';
      line1 = 'van ' + formatLocale(start, multipleFormat).toLowerCase();
      line2 = 'tot ' + formatLocale(end, multipleFormat).toLowerCase();
    }

    return line1 + '\n' + line2;
  }

  isJoinable(): boolean {
    if (this.event._meta.category === 'maaltijd') {
      const notClosed = this.event.gesloten === '0';
      return notClosed;
    } else {
      const hasOpened =
        this.event.aanmelden_vanaf === null ||
        isPast(this.event.aanmelden_vanaf);
      const notClosed =
        this.event.aanmelden_tot === null || isFuture(this.event.aanmelden_tot);
      return hasOpened && notClosed;
    }
  }

  isLeaveable(): boolean {
    if (this.event._meta.category === 'maaltijd') {
      const notClosed = this.event.gesloten === '0';
      return notClosed;
    } else {
      const notClosed =
        this.event.afmelden_tot !== null && isFuture(this.event.afmelden_tot);
      return notClosed;
    }
  }

  join() {
    const cat = this.event._meta.category + 'en';
    const id = this.event.id || this.event.maaltijd_id;

    this.processingAction = true;

    this.api
      .postAction(cat, id, 'aanmelden')
      .toPromise()
      .then(
        (event: Event) => {
          this.api.addJoined(cat, Number(id));
          this.event = this.api.addEventMeta(event);
          return 'Aanmelden gelukt!';
        },
        error => {
          return 'Aanmelden mislukt: ' + error;
        }
      )
      .then(message => {
        this.notifier.notify(message);
        this.processingAction = false;
      });
  }

  leave() {
    const cat = this.event._meta.category + 'en';
    const id = this.event.id || this.event.maaltijd_id;

    this.processingAction = true;

    this.api
      .postAction(cat, id, 'afmelden')
      .toPromise()
      .then(
        (event: Event) => {
          this.api.removeJoined(cat, Number(id));
          this.event = this.api.addEventMeta(event);
          return 'Afmelden gelukt!';
        },
        error => {
          return 'Afmelden mislukt: ' + error;
        }
      )
      .then(message => {
        this.notifier.notify(message);
        this.processingAction = false;
      });
  }

  viewExternal() {
    const url =
      AppConfig.ENV.siteUrl + `/groepen/activiteiten/${this.event.id}/`;
    this.urlService.open(url);
  }
}
