import { Injectable } from '@angular/core';
import addDays from 'date-fns/add_days';
import addHours from 'date-fns/add_hours';
import isSameDay from 'date-fns/is_same_day';
import parse from 'date-fns/parse';
import { Observable } from 'rxjs/Observable';

import { Event } from '../../models/event';
import { Member, MemberDetail } from '../../state/members/members.model';
import { ForumPost } from '../../state/posts/posts.model';
import { ForumTopic } from '../../state/topics/topics.model';
import { formatLocale, isFullDay } from '../../util/dates';
import { memberDetailMock, membersMock, postsMock, topicsMock } from '../../util/mocks';
import { AuthService } from '../auth/auth';
import { HttpService } from '../http/http';

@Injectable()
export class ApiService {
  private scheduleList: any[] = [];
  private joinedEvents: any = {
    maaltijden: [],
    activiteiten: []
  };

  constructor(
    private authService: AuthService,
    private httpService: HttpService
  ) {}

  getScheduleList(from: Date, to: Date): Promise<Event[]> {
    return new Promise((resolve, reject) => {
      const fromISO = from.toISOString();
      const toISO = to.toISOString();

      this.httpService.getFromApi('/agenda?from=' + fromISO + '&to=' + toISO, 'get')
        .subscribe((res: { events: Event[], joined: { activiteiten: number[], maaltijden: number[] } }) => {
          const schedule = {
            from: new Date(from),
            to: new Date(to),
            events: res.events
          };
          this.scheduleList.push(schedule);

          this.joinedEvents.maaltijden.push(...res.joined.maaltijden);
          this.joinedEvents.activiteiten.push(...res.joined.activiteiten);

          resolve(schedule.events);
        }, error => {
          reject(error);
        });
    });
  }

  addEventMeta(event: Event): Event {
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
    let present = false;

    if (event.maaltijd_id) {
      category = 'maaltijd';
      event.prijs = event.prijs.slice(0, -2) + ',' + event.prijs.substr(-2);
      present = this.joinedEvents.maaltijden.indexOf(Number(event.maaltijd_id)) !== -1;
    } else if (event.id) {
      category = 'activiteit';
      present = this.joinedEvents.activiteiten.indexOf(Number(event.id)) !== -1;
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

  addJoined(cat: string, id: number) {
    if (cat === 'maaltijden') {
      this.joinedEvents.maaltijden.push(id);
    } else {
      this.joinedEvents.activiteiten.push(id);
    }
  }

  removeJoined(cat: string, id: number) {
    if (cat === 'maaltijden') {
      const index = this.joinedEvents.maaltijden.indexOf(id);
      this.joinedEvents.maaltijden.splice(index, 1);
    } else {
      const index = this.joinedEvents.activiteiten.indexOf(id);
      this.joinedEvents.activiteiten.splice(index, 1);
    }
  }

  getForumRecent(offset: number, limit: number): Observable<ForumTopic[]> {
    if (this.useMock()) {
      return Observable.of(topicsMock as ForumTopic[]);
    }

    return this.httpService.getFromApi(`/forum/recent?offset=${offset}&limit=${limit}`, 'get');
  }

  getForumTopic(id: number, offset: number, limit: number): Observable<ForumPost[]> {
    if (this.useMock()) {
      return Observable.of(postsMock as ForumPost[]);
    }

    return this.httpService.getFromApi(`/forum/onderwerp/${id}?offset=${offset}&limit=${limit}`, 'get');
  }

  getMemberList(): Observable<Member[]> {
    if (this.useMock()) {
      return Observable.of(membersMock as Member[]);
    }

    return this.httpService.getFromApi('/leden', 'get');
  }

  getMemberDetail(id: string): Observable<MemberDetail> {
    if (this.useMock()) {
      return Observable.of(memberDetailMock as MemberDetail);
    }

    return this.httpService.getFromApi('/leden/' + id, 'get');
  }

  postAction(cat: string, id: number, action: string): Observable<any> {
    return this.httpService.getFromApi('/' + cat + '/' + id + '/' + action, 'post');
  }

  private useMock() {
    return this.authService.isDemo();
  }
}
