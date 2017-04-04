import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import { AppConfig } from '../app/app.config';
import { AuthService } from '../providers/auth';
import { parseJsonDates } from '../util/data';

@Injectable()
export class HttpService {

  constructor(
    private authHttp: AuthHttp,
    private authService: AuthService
  ) {}

  public getFromApi(url: string, method: string): Observable<any> {
    return this.authHttp.request(AppConfig.API_ENDPOINT + url, {
      method: method,
    })
    .map(res => parseJsonDates(res))
    .map(data => data.data)
    .catch((error: Response) => {
      if (error.status === 401) {
        return this.authService.logout(true);
      }

      try {
        const data = error.json();
        if (data && data.error && data.error.message) {
          return data.error.message;
        }
      } catch (e) {
        return e;
      }
    });
  }
}
