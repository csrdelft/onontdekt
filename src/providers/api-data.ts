import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import _ from 'lodash';
import moment from 'moment';
import 'rxjs/add/operator/map';

import { AppSettings } from '../constants/app-settings';
import { AuthService } from '../providers/auth';
import { Event } from '../models/event';
import { Member, IMemberShort } from '../models/member';
import { IForumTopic, IForumPost } from '../models/forum';

@Injectable()
export class ApiData {
  private _scheduleList: any[] = [];
  private _joinedEvents: any = {
    maaltijden: [],
    activiteiten: []
  };
  private _memberList: IMemberShort[] = [];
  private _memberDetail: Member[] = [];

  constructor(
    private authHttp: AuthHttp,
    private authService: AuthService
  ) {}

  public getScheduleList(fromMoment: any, toMoment: any): Promise<Event[]> {
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

  public addEventMeta(event: Event): Event {
    let meta: any = {};

    meta.start = moment(event.begin_moment || (event.datum + ' ' + event.tijd));
    meta.end = event.eind_moment ? moment(event.eind_moment) : moment(meta.start).add(2, 'hours');

    let sameDay: boolean = meta.start.isSame(meta.end, 'day');
    let sameDayLate: boolean = moment(meta.start).add(1, 'day').isSame(meta.end, 'day') && meta.end.hour() < 8;
    let allDay: boolean = meta.start.format('LT') === '00:00' && meta.end.format('LT') === '23:59';
    if (!sameDay && !sameDayLate) {
      let format: string = allDay ? 'dddd D MMMM' : 'dddd D MMMM LT';
      meta.formattedListDate = meta.start.format(format) + ' – ' + meta.end.format(format);
    } else if (allDay) {
      meta.formattedListDate = 'Hele dag';
    } else {
      meta.formattedListDate = meta.start.format('LT') + ' – ' + meta.end.format('LT') + ' uur';
    }

    if (event.maaltijd_id) {
      meta.category = 'maaltijd';
      event.prijs = event.prijs.slice(0, -2) + ',' + event.prijs.substr(-2);
      meta.present = _.indexOf(this._joinedEvents.maaltijden, Number(event.maaltijd_id)) !== -1;
    } else if (event.id) {
      meta.category = 'activiteit';
      meta.present = _.indexOf(this._joinedEvents.activiteiten, Number(event.id)) !== -1;
    } else {
      meta.category = 'agenda';
    }

    if (event.titel) {
      event.titel = event.titel.replace(/&amp;/g, '&');
    }

    if (event.naam) {
      event.naam = event.naam.replace(/&amp;/g, '&');
    }

    event._meta = meta;
    return event;
  }

  public addJoined(cat: string, id: number) {
    if (cat === 'maaltijden') {
      this._joinedEvents.maaltijden.push(id);
    } else {
      this._joinedEvents.activiteiten.push(id);
    }
  }

  public removeJoined(cat: string, id: number) {
    if (cat === 'maaltijden') {
      let index = _.indexOf(this._joinedEvents.maaltijden, id);
      this._joinedEvents.maaltijden.splice(index, 1);
    } else {
      let index = _.indexOf(this._joinedEvents.activiteiten, id);
      this._joinedEvents.activiteiten.splice(index, 1);
    }
  }

  public getForumRecent(offset: number, limit: number): Promise<IForumTopic[]> {
    return this.getFromApi(`/forum/recent?offset=${offset}&limit=${limit}`, 'get');
  }

  public getForumTopic(id: number, offset: number, limit: number): Promise<IForumPost[]> {
    return this.getFromApi(`/forum/onderwerp/${id}?offset=${offset}&limit=${limit}`, 'get');
  }

  public getMemberList(): Promise<IMemberShort[]> {
    if (this._memberList.length > 0) {
      return Promise.resolve(this._memberList);
    }

    return new Promise((resolve, reject) => {
      this.getFromApi('/leden', 'get').then((res: IMemberShort[]) => {
        this._memberList = res;
        resolve(this._memberList);
      }, error => {
        reject();
      });
    });
  }

  public getMemberDetail(id: number): Promise<Member> {
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

  public postAction(cat: string, id: number, action: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getFromApi('/' + cat + '/' + id + '/' + action, 'post').then(res => {
        resolve(res);
      }, error => {
        reject(error);
      });
    });
  }

  private getFromApi(url: string, method: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.authHttp.request(AppSettings.API_ENDPOINT + url, {
        method: method,
      })
      .map(res => this.deserialize(res.text()))
      .subscribe(
        data => resolve(data.data),
        (error: Response) => {
          if (error.status === 401) {
            this.authService.logout(true);
          } else {
            try {
              const data = error.json();
              reject(data && data.error && data.error.message);
            } catch (e) {
              reject();
            }
          }
        }
      );
    });
  }

  private deserialize(data: string): any {
    try {
      return JSON.parse(data, this.reviveDateTime);
    } catch (error) {
      return {};
    }
  }

  private reviveDateTime(key: any, value: any): any {
    if (typeof value === 'string' && /^\d{4}-\d\d-\d\d\ \d\d:\d\d:\d\d$/.test(value)) {
      return new Date(value);
    }

    return value;
  }
}
