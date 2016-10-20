import { Component } from '@angular/core';
import { NavParams, Toast } from 'ionic-angular';
import { GoogleAnalytics } from 'ionic-native';
import moment from 'moment';
import 'moment/src/locale/nl';

import { MapsHrefDirective } from '../../directives/maps-href';
import { NotificationService } from '../../services/notification';
import { ApiData } from '../../services/api-data';
import { Event } from '../../models/event';


@Component({
  templateUrl: 'event-detail.html'
})
export class EventDetailPage {
  event: Event;
  processingAction: boolean = false;

  constructor(
    private apiData: ApiData,
    private notifier: NotificationService,
    navParams: NavParams
  ) {
    this.event = navParams.data;
  }

  getDateTimes(start: any, end: any): string {
    let line1, line2: string;
    let multipleDays: boolean = !start.isSame(end, 'day');
    let fullDay = start.format('HHmm') === '0000' && end.format('HHmm') === '2359';

    if (multipleDays) {
      let multipleFormat = fullDay ? 'dddd ll' : 'LT [op] dd ll';
      line1 = 'van ' + start.format(multipleFormat).toLowerCase();
      line2 = 'tot ' + end.format(multipleFormat).toLowerCase();
    } else {
      line1 = start.format('dddd ll').toLowerCase();
      line2 = fullDay ? 'Hele dag' : start.format('[van] LT [tot] ') + end.format('LT');
    }

    return line1 + '\n' + line2;
  }

  isJoinable(): boolean {
    if (this.event._meta.category === 'maaltijd') {
      let notClosed = this.event.gesloten === '0';
      return notClosed;
    } else {
      let hasOpened = this.event.aanmelden_vanaf === null || moment(this.event.aanmelden_vanaf).isBefore();
      let notClosed = this.event.aanmelden_tot === null || moment(this.event.aanmelden_tot).isAfter();
      return hasOpened && notClosed;
    }
  }

  isLeaveable(): boolean {
    if (this.event._meta.category === 'maaltijd') {
      let notClosed = this.event.gesloten === '0';
      return notClosed;
    } else {
      let notClosed = this.event.afmelden_tot !== null && moment(this.event.afmelden_tot).isAfter();
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
      GoogleAnalytics.trackEvent('Events', 'Join', event._meta.category, id);
      return 'Aanmelden gelukt!';
    }, error => {
      console.log(error);
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
      GoogleAnalytics.trackEvent('Events', 'Leave', event._meta.category, id);
      return 'Afmelden gelukt!';
    }, error => {
      console.log(error);
      return 'Afmelden mislukt: ' + error;
    }).then(message => {
      this.notifier.notify(message);
      this.processingAction = false;
    });
  }

  ionViewDidEnter() {
    GoogleAnalytics.trackView('Event Detail');
  }
}