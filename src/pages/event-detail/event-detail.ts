import { Component } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { IonicPage, NavParams } from 'ionic-angular';
import isSameDay from 'date-fns/is_same_day';
import isPast from 'date-fns/is_past';
import isFuture from 'date-fns/is_future';

import { formatLocale, isFullDay } from '../../util/dates';
import { NotificationService } from '../../providers/notification';
import { ApiData } from '../../providers/api-data';
import { Event } from '../../models/event';

@IonicPage()
@Component({
  templateUrl: 'event-detail.html'
})
export class EventDetailPage {
  event: Event;
  processingAction: boolean = false;

  constructor(
    private apiData: ApiData,
    private notifier: NotificationService,
    private googleAnalytics: GoogleAnalytics,
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
      line2 = fullDay ? 'Hele dag' : formatLocale(start, '[van] HH:mm [tot] ') + formatLocale(end, 'HH:mm');
    } else {
      let multipleFormat = fullDay ? 'dddd D MMM YYYY' : 'HH:mm [op] dd D MMM YYYY';
      line1 = 'van ' + formatLocale(start, multipleFormat).toLowerCase();
      line2 = 'tot ' + formatLocale(end, multipleFormat).toLowerCase();
    }

    return line1 + '\n' + line2;
  }

  isJoinable(): boolean {
    if (this.event._meta.category === 'maaltijd') {
      let notClosed = this.event.gesloten === '0';
      return notClosed;
    } else {
      let hasOpened = this.event.aanmelden_vanaf === null || isPast(this.event.aanmelden_vanaf);
      let notClosed = this.event.aanmelden_tot === null || isFuture(this.event.aanmelden_tot);
      return hasOpened && notClosed;
    }
  }

  isLeaveable(): boolean {
    if (this.event._meta.category === 'maaltijd') {
      let notClosed = this.event.gesloten === '0';
      return notClosed;
    } else {
      let notClosed = this.event.afmelden_tot !== null && isFuture(this.event.afmelden_tot);
      return notClosed;
    }
  }

  public join() {
    let cat = this.event._meta.category + 'en';
    let id = this.event.id || this.event.maaltijd_id;

    this.processingAction = true;

    this.apiData.postAction(cat, id, 'aanmelden').then((event: Event) => {
      this.apiData.addJoined(cat, Number(id));
      this.event = this.apiData.addEventMeta(event);
      if ((GoogleAnalytics as any)['installed']()) {
        this.googleAnalytics.trackEvent('Events', 'Join', event._meta.category, id);
      }
      return 'Aanmelden gelukt!';
    }, error => {
      return 'Aanmelden mislukt: ' + error;
    }).then(message => {
      this.notifier.notify(message);
      this.processingAction = false;
    });
  }

  public leave() {
    let cat = this.event._meta.category + 'en';
    let id = this.event.id || this.event.maaltijd_id;

    this.processingAction = true;

    this.apiData.postAction(cat, id, 'afmelden').then((event: Event) => {
      this.apiData.removeJoined(cat, Number(id));
      this.event = this.apiData.addEventMeta(event);
      if ((GoogleAnalytics as any)['installed']()) {
        this.googleAnalytics.trackEvent('Events', 'Leave', event._meta.category, id);
      }
      return 'Afmelden gelukt!';
    }, error => {
      return 'Afmelden mislukt: ' + error;
    }).then(message => {
      this.notifier.notify(message);
      this.processingAction = false;
    });
  }

  ionViewDidEnter() {
    if ((GoogleAnalytics as any)['installed']()) {
      this.googleAnalytics.trackView('Event Detail');
    }
  }
}
