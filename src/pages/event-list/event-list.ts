import { Component } from '@angular/core';
import addDays from 'date-fns/add_days';
import endOfDay from 'date-fns/end_of_day';
import startOfToday from 'date-fns/start_of_today';
import { InfiniteScroll, NavController, Refresher } from 'ionic-angular';

import { Event } from '../../models/event';
import { ApiService } from '../../services/api/api';
import { formatLocale } from '../../util/dates';
import { EventDetailPage } from '../event-detail/event-detail';

export interface EventGroup {
  date: string;
  events: Event[];
}

const DAYS_TO_LOAD: number = 42;

@Component({
  selector: 'csr-event-list',
  templateUrl: 'event-list.html'
})
export class EventListPage {
  groups: EventGroup[] = [];

  moreAvailable: boolean = true;
  failedToLoad: boolean = false;

  private from: Date;
  private to: Date;

  constructor(
    private api: ApiService,
    private navCtrl: NavController
  ) {
    this.initializeMoments();
    this.updateSchedule(this.from, this.to);
  }

  initializeMoments() {
    this.from = startOfToday();
    this.to = endOfDay(addDays(new Date(), DAYS_TO_LOAD - 1));
  }

  updateSchedule(from: Date, to: Date, reset: boolean = false): Promise<boolean> {
    return this.api.getScheduleList(from, to)
      .then((events: Event[]) => {

        if (events.length === 0) {
          return false;
        }

        events.forEach(event => {
          event = this.api.addEventMeta(event);
        });

        const grouped: { [key: string]: Event[] } = events.reduce(
          (result: { [key: string]: Event[] }, event) => {
            const key = formatLocale(event._meta.start, 'dddd D MMMM');
            (result[key] = result[key] || []).push(event);
            return result;
          },
        {});

        const mapped = Object.keys(grouped).map(key => {
          return {
            date: key,
            events: grouped[key]
          };
        });

        if (reset) {
          this.groups = mapped;
        } else {
          this.groups.push(...mapped);
        }

        return true;
      }, () => {
        this.failedToLoad = true;
      });
  }

  doInfinite(infiniteScroll: InfiniteScroll) {
    this.from = addDays(this.from, DAYS_TO_LOAD);
    this.to = addDays(this.to, DAYS_TO_LOAD);

    this.updateSchedule(this.from, this.to).then(hasEvents => {
      if (hasEvents === true) {
        infiniteScroll.complete();
      } else {
        infiniteScroll.enable(false);
        this.moreAvailable = false;
      }
    });
  }

  doRefresh(refresher: Refresher) {
    this.initializeMoments();
    this.updateSchedule(this.from, this.to, true).then((hasEvents) => {
      refresher.complete();
    });
  }

  doRetryLoad() {
    this.failedToLoad = false;
    this.updateSchedule(this.from, this.to);
  }

  goToEventDetail(event: Event) {
    this.navCtrl.push(EventDetailPage, event);
  }

  identifyGroup(index: number, group: { date: string; events: Event[] }) {
    return group.date;
  }

  identify(index: number, event: Event) {
    return event.UUID;
  }

}
