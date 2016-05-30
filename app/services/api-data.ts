import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import * as _ from 'lodash';
import * as moment from 'moment';
import 'moment/locale/nl';
import 'rxjs/add/operator/map';

import { AppSettings } from '../constants/app-settings';
import { AuthService } from '../services/auth';
import { Event } from '../models/event';
import { Member } from '../models/member';


@Injectable()
export class ApiData {
  _scheduleList = [];
  _joinedEvents = {
    maaltijden: [],
    activiteiten: []
  };
  _memberList = [];
  _memberDetail = [];

  constructor(
    private authHttp: AuthHttp,
    private authService: AuthService
  ) {}

  getScheduleList(fromMoment: any, toMoment: any) {
    if (this._scheduleList.length > 0) {
      let found = _.find(this._scheduleList, { from: fromMoment, to: toMoment });
      if (found) {
        return Promise.resolve(found.events);
      }
    }

    return new Promise((resolve, reject) => {
      let fromISO = fromMoment.toISOString();
      let toISO = toMoment.toISOString();

      this.getFromApi('/agenda?from=' + fromISO + '&to=' + toISO, 'get')
        .then((res: { events: Event[], joined: { activiteiten: number[], maaltijden: number[] } }) => {
          let schedule = {
            from: fromMoment.clone(),
            to: toMoment.clone(),
            events: res.events
          };
          this._scheduleList.push(schedule);

          this._joinedEvents.maaltijden.push(...res.joined.maaltijden);
          this._joinedEvents.activiteiten.push(...res.joined.activiteiten);

          resolve(schedule.events);
        }, error => {
          reject();
        });
    });
  }

  addEventMeta(event: Event) {
    event._meta = {
      start_moment: null,
      end_moment: null,
      start: null,
      end: null,
      category: null
    };

    if (event.datum && event.tijd) {
      event._meta.start_moment = moment(event.datum + ' ' + event.tijd);
      event._meta.end_moment = moment(event._meta.start_moment).add(2, 'hours');
    } else {
      event._meta.start_moment = moment(event.begin_moment);
      event._meta.end_moment = moment(event.eind_moment);
    }

    event._meta.start = event._meta.start_moment.format('LT');
    event._meta.end = event._meta.end_moment.format('LT');

    if (event.maaltijd_id) {
      event._meta.category = 'maaltijd';
      event.prijs = event.prijs.slice(0, -2) + ',' + event.prijs.substr(-2);
      event._meta.present = _.indexOf(this._joinedEvents.maaltijden, Number(event.maaltijd_id)) !== -1;
    } else if (event.id) {
      event._meta.category = 'activiteit';
      event._meta.present = _.indexOf(this._joinedEvents.activiteiten, Number(event.id)) !== -1;
    } else {
      event._meta.category = 'agenda';
    }

    return event;
  }

  addJoined(cat: string, id: number) {
    if (cat === 'maaltijden') {
      this._joinedEvents.maaltijden.push(id);
    } else {
      this._joinedEvents.activiteiten.push(id);
    }
  }

  removeJoined(cat: string, id: number) {
    if (cat === 'maaltijden') {
      let index = _.indexOf(this._joinedEvents.maaltijden, id);
      this._joinedEvents.maaltijden.splice(index, 1);
    } else {
      let index = _.indexOf(this._joinedEvents.activiteiten, id);
      this._joinedEvents.activiteiten.splice(index, 1);
    }
  }

  postAction(cat, id, action) {
    return new Promise((resolve, reject) => {
      this.getFromApi('/' + cat + '/' + id + '/' + action, 'post').then(res => {
        resolve(res);
      }, error => {
        reject(error);
      });
    });
  }

  getMemberList() {
    if (this._memberList.length > 0) {
      return Promise.resolve(this._memberList);
    }

    return new Promise(resolve => {
      this.getFromApi('/leden', 'get').then((res: Member[]) => {
        this._memberList = res;
        resolve(this._memberList);
      });
    });
  }

  getMemberDetail(id: number) {
    return new Promise(resolve => {
      let member = this._memberDetail.filter((member: Member) => member.id === id);

      if (member.length > 0) {
        resolve(member[0]);
      } else {
        this.getFromApi('/leden/' + id, 'get').then(res => {
          this._memberDetail.push(res);
          resolve(res);
        });
      }
    });
  }

  getFromApi(url, method) {
    return new Promise((resolve, reject) => {
      this.authHttp.request(AppSettings.API_ENDPOINT + url, {
        method: method,
      })
      .map(res => res.json())
      .subscribe(
        data => resolve(data.data),
        error => {
          if (error.status === 401) {
            this.authService.logout(true);
          } else {
            console.log(error);
            reject();
          }
        }
      );
    });
  }

}
