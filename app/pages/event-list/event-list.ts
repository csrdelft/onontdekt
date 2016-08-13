import { Component } from '@angular/core';
import { Alert, Modal, NavController } from 'ionic-angular';
import { GoogleAnalytics } from 'ionic-native';
import * as _ from 'lodash';
import * as moment from 'moment';
import 'moment/locale/nl';

import { ApiData } from '../../services/api-data';
import { Event } from '../../models/event';
import { EventDetailPage } from '../event-detail/event-detail';


interface EventGroup {
  date: string;
  events: Event[];
};

const DAYS_TO_LOAD: number = 42;

@Component({
  templateUrl: 'build/pages/event-list/event-list.html'
})
export class EventListPage {
  groups: EventGroup[] = [];

  moreAvailable: boolean = true;
  failedToLoad: boolean = false;

  fromMoment: any;
  toMoment: any;

  constructor(
    private apiData: ApiData,
    private navCtrl: NavController
  ) {
    this.initializeMoments();
    this.updateSchedule(this.fromMoment, this.toMoment);
  }

  initializeMoments() {
    this.fromMoment = moment().startOf('day');
    this.toMoment = moment(this.fromMoment).add(DAYS_TO_LOAD - 1, 'days').endOf('day');
  }

  updateSchedule(fromMoment: any, toMoment: any, reset: boolean = false): Promise<boolean> {
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

  doInfinite(infiniteScroll) {
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

  doRefresh(refresher) {
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
    this.navCtrl.push(EventDetailPage, event);
  }

  ionViewDidEnter() {
    GoogleAnalytics.trackView('Event List');
  }

}
