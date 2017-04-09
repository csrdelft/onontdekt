import { Injectable } from '@angular/core';
import addDays from 'date-fns/add_days';
import addHours from 'date-fns/add_hours';
import isSameDay from 'date-fns/is_same_day';
import parse from 'date-fns/parse';
import { Observable } from 'rxjs/Observable';

import { HttpService } from './http';
import { Event } from '../models/event';
import { Member, MemberDetail } from '../state/members/members.model';
import { ForumTopic, ForumPost } from '../state/topics/topics.model';
import { formatLocale, isFullDay } from '../util/dates';

@Injectable()
export class ApiService {
  private _scheduleList: any[] = [];
  private _joinedEvents: any = {
    maaltijden: [],
    activiteiten: []
  };

  constructor(
    private httpService: HttpService
  ) {}

  public getScheduleList(from: Date, to: Date): Promise<Event[]> {
    return new Promise((resolve, reject) => {
      let fromISO = from.toISOString();
      let toISO = to.toISOString();

      this.httpService.getFromApi('/agenda?from=' + fromISO + '&to=' + toISO, 'get')
        .subscribe((res: { events: Event[], joined: { activiteiten: number[], maaltijden: number[] } }) => {
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
          reject(error);
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

  public getForumRecent(offset: number, limit: number): Observable<ForumTopic[]> {
    return this.httpService.getFromApi(`/forum/recent?offset=${offset}&limit=${limit}`, 'get');
  }

  public getForumTopic(id: number, offset: number, limit: number): Observable<ForumPost[]> {
    return this.httpService.getFromApi(`/forum/onderwerp/${id}?offset=${offset}&limit=${limit}`, 'get');
  }

  public getMemberList(): Observable<Member[]> {
    return this.httpService.getFromApi('/leden', 'get');
  }

  public getMemberDetail(id: string): Observable<MemberDetail> {
    return this.httpService.getFromApi('/leden/' + id, 'get');
  }

  public postAction(cat: string, id: number, action: string): Observable<any> {
    return this.httpService.getFromApi('/' + cat + '/' + id + '/' + action, 'post');
  }

}
