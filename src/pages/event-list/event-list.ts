import { Component } from '@angular/core';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NavController, InfiniteScroll, IonicPage, Refresher } from 'ionic-angular';
import _ from 'lodash';
import moment from 'moment';
// import 'moment/src/locale/nl';

import { ApiData } from '../../providers/api-data';
import { Event } from '../../models/event';

export interface EventGroup {
  date: string;
  events: Event[];
};

const DAYS_TO_LOAD: number = 42;

@IonicPage()
@Component({
  templateUrl: 'event-list.html'
})
export class EventListPage {
  groups: EventGroup[] = [];

  moreAvailable: boolean = true;
  failedToLoad: boolean = false;

  fromMoment: moment.Moment;
  toMoment: moment.Moment;

  constructor(
    private apiData: ApiData,
    private googleAnalytics: GoogleAnalytics,
    private navCtrl: NavController
  ) {
    this.initializeMoments();
    this.updateSchedule(this.fromMoment, this.toMoment);
  }

  initializeMoments() {
    this.fromMoment = moment().startOf('day');
    this.toMoment = moment(this.fromMoment).add(DAYS_TO_LOAD - 1, 'days').endOf('day');
  }

  updateSchedule(fromMoment: moment.Moment, toMoment: moment.Moment, reset: boolean = false): Promise<boolean> {
    return this.apiData.getScheduleList(fromMoment, toMoment)
      .then((events: Event[]) => {

        if (events.length === 0) {
          return false;
        }

        events.forEach(event => {
          event = this.apiData.addEventMeta(event);
        });

        let grouped = _.groupBy(events, event => {
          return event._meta.start.format('dddd D MMMM');
        });

        let mapped = _.map(grouped, (value, key) => {
          return {
            'date': key,
            'events': value
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
    this.fromMoment.add(DAYS_TO_LOAD, 'days');
    this.toMoment.add(DAYS_TO_LOAD, 'days');

    this.updateSchedule(this.fromMoment, this.toMoment).then(hasEvents => {
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
    this.updateSchedule(this.fromMoment, this.toMoment, true).then((hasEvents) => {
      refresher.complete();
    });
  }

  doRetryLoad() {
    this.failedToLoad = false;
    this.updateSchedule(this.fromMoment, this.toMoment);
  }

  goToEventDetail(event: Event) {
    this.navCtrl.push('EventDetailPage', event);
  }

  ionViewDidEnter() {
    if ((GoogleAnalytics as any)['installed']()) {
      this.googleAnalytics.trackView('Event List');
    }
  }

}
