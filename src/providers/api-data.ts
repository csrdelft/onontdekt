import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import addDays from 'date-fns/add_days';
import addHours from 'date-fns/add_hours';
import isSameDay from 'date-fns/is_same_day';
import parse from 'date-fns/parse';

import { AppSettings } from '../constants/app-settings';
import { AuthService } from '../providers/auth';
import { Event } from '../models/event';
import { Member, IMemberShort } from '../models/member';
import { IForumTopic, IForumPost } from '../models/forum';
import { formatLocale, isFullDay } from '../util/dates';

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

  public getScheduleList(from: Date, to: Date): Promise<Event[]> {
    return new Promise((resolve, reject) => {
      let fromISO = from.toISOString();
      let toISO = to.toISOString();

      this.getFromApi('/agenda?from=' + fromISO + '&to=' + toISO, 'get')
        .then((res: { events: Event[], joined: { activiteiten: number[], maaltijden: number[] } }) => {
          let schedule = {
            from: new Date(from),
            to: new Date(to),
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
    const start = event.begin_moment ? event.begin_moment : parse(event.datum + ' ' + event.tijd);
    const end = event.eind_moment ? event.eind_moment : addHours(start, 2);

    let formattedListDate: string;
    const sameDay = isSameDay(start, end);
    const sameDayLate = isSameDay(addDays(start, 1), end) && end.getHours() < 8;
    const allDay = isFullDay(start, end);

    if (!sameDay && !sameDayLate) {
      const formatText = allDay ? 'dddd D MMMM' : 'dddd D MMMM HH:mm';
      formattedListDate = formatLocale(start, formatText) + ' – ' + formatLocale(end, formatText);
    } else if (allDay) {
      formattedListDate = 'Hele dag';
    } else {
      formattedListDate = formatLocale(start, 'HH:mm') + ' – ' + formatLocale(end, 'HH:mm') + ' uur';
    }

    let category: 'maaltijd' | 'activiteit' | 'agenda';
    let present: boolean;

    if (event.maaltijd_id) {
      category = 'maaltijd';
      event.prijs = event.prijs.slice(0, -2) + ',' + event.prijs.substr(-2);
      present = this._joinedEvents.maaltijden.indexOf(Number(event.maaltijd_id)) !== -1;
    } else if (event.id) {
      category = 'activiteit';
      present = this._joinedEvents.activiteiten.indexOf(Number(event.id)) !== -1;
    } else {
      category = 'agenda';
    }

    if (event.titel) {
      event.titel = event.titel.replace(/&amp;/g, '&');
    }

    if (event.naam) {
      event.naam = event.naam.replace(/&amp;/g, '&');
    }

    event._meta = {
      start,
      end,
      formattedListDate,
      category,
      present
    };

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
      let index = this._joinedEvents.maaltijden.indexOf(id);
      this._joinedEvents.maaltijden.splice(index, 1);
    } else {
      let index = this._joinedEvents.activiteiten.indexOf(id);
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
