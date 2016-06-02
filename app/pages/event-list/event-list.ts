import { Alert, Modal, NavController, Page, Platform } from 'ionic-angular';
import { Splashscreen } from 'ionic-native';
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

@Page({
  templateUrl: 'build/pages/event-list/event-list.html'
})
export class EventListPage {
  groups: EventGroup[] = [];

  fromMoment: any = moment().startOf('day');
  toMoment: any = moment(this.fromMoment).add(27, 'days').endOf('day');
  moreAvailable: boolean = true;
  failedToLoad: boolean = false;

  constructor(
    private apiData: ApiData,
    private nav: NavController,
    platform: Platform
  ) {
    this.updateSchedule(this.fromMoment, this.toMoment);

    platform.ready().then(() => {
      Splashscreen.hide();
    });
  }

  updateSchedule(fromMoment, toMoment) {
    return this.apiData.getScheduleList(fromMoment, toMoment)
      .then((events: Event[]) => {

        if (events.length === 0) {
          return false;
        }

        events.forEach(event => {
          event = this.apiData.addEventMeta(event);
        });

        let dateFormat = 'dddd D MMMM';

        let grouped = _.groupBy(events, event => {
          let key = event._meta.start_moment.format(dateFormat);
          if (!event._meta.start_moment.isSame(event._meta.end_moment, 'day')) {
            key += ' – ' + event._meta.end_moment.format(dateFormat);
          }
          return key;
        });

        let mapped = _.map(grouped, (value, key) => {
          return {
            'date': key,
            'events': value
          };
        });

        this.groups.push(...mapped);
        return true;
      }, () => {
        this.failedToLoad = true;
      });
  }

  doInfinite(infiniteScroll) {
    this.fromMoment.add(28, 'days');
    this.toMoment.add(28, 'days');

    this.updateSchedule(this.fromMoment, this.toMoment).then(hasEvents => {
      if (hasEvents === true) {
        infiniteScroll.complete();
      } else {
        infiniteScroll.enable(false);
        this.moreAvailable = false;
      }
    });
  }

  goToEventDetail(event: Event) {
    this.nav.push(EventDetailPage, event);
  }

}
