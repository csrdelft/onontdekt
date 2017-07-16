import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AuthHttp, JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';

import { AppConfig } from '../../app/app.config';

@Injectable()
export class AuthService {
  private jwtHelper = new JwtHelper();
  private refreshSubscription: any;
  private userId: string | undefined;

  constructor(
    private http: Http,
    private authHttp: AuthHttp,
    private storage: Storage
  ) {
    this.storage.get('userId').then((userId: string) => {
      if (userId) {
        this.userId = userId;
      }
    });
  }

  tryAuthentication(): Promise<boolean> {
    if (this.authenticated()) {
      this.startupTokenRefresh();
      return Promise.resolve(true);
    }

    return new Promise((resolve) => {
      this.hasRefreshToken().then(res => {
        if (res === true) {
          this.getNewJwt().then(() => {
            this.scheduleRefresh();
            resolve(true);
          }, (unauthorized: boolean) => {
            if (unauthorized) {
              resolve(false);
            } else {
              // No connection?
              resolve(true);
            }
          });
        } else {
          resolve(false);
        }
      });
    });
  }

  login(username: string, password: string): Promise<any> {
    const url = AppConfig.API_ENDPOINT + '/auth/authorize';
    const params = 'user=' + username + '&pass=' + password;

    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return new Promise((resolve, reject) => {
      this.http.post(url, params, {
        headers
      }).subscribe(res => {
        const data = res.json();
        this.userId = username;
        this.storage.set('userId', this.userId);
        this.storage.set('id_token', data.token);
        localStorage.setItem('id_token', data.token);
        this.storage.set('refresh_token', data.refreshToken);
        this.scheduleRefresh();
        resolve();
      }, error => {
        reject(error);
      });
    });
  }

  logout(reload: boolean = false) {
    this.storage.remove('userId');
    this.userId = undefined;
    this.storage.remove('id_token');
    localStorage.removeItem('id_token');
    this.storage.remove('refresh_token');
    this.unscheduleRefresh();

    if (reload === true) {
      location.reload();
    }
  }

  isDemo() {
    return this.userId === 'x037';
  }

  private authenticated(): boolean {
    return tokenNotExpired();
  }

  private hasRefreshToken(): Promise<boolean> {
    return this.storage.get('refresh_token').then((value: string) => {
      return !!value;
    });
  }

  private scheduleRefresh() {
    const source = this.authHttp.tokenStream.flatMap((token: string) => {
      const jwtIat: number = this.jwtHelper.decodeToken(token).iat;
      const jwtExp: number = this.jwtHelper.decodeToken(token).exp;
      const iat = new Date(0);
      const exp = new Date(0);
      const delay = (exp.setUTCSeconds(jwtExp) - iat.setUTCSeconds(jwtIat));

      return Observable.interval(delay - 15);
    });

    this.refreshSubscription = source.subscribe(() => {
      this.getNewJwt();
    });
  }

  private unscheduleRefresh() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  private startupTokenRefresh() {
    const source = this.authHttp.tokenStream.flatMap((token: string) => {
      const now = new Date().valueOf();
      const jwtExp: number = this.jwtHelper.decodeToken(token).exp;
      const exp = new Date(0);
      exp.setUTCSeconds(jwtExp);
      const delay = exp.valueOf() - now;

      return Observable.timer(delay - 15);
    });

    source.subscribe(() => {
      this.getNewJwt();
      this.scheduleRefresh();
    });
  }

  private getNewJwt(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.get('refresh_token').then(refreshToken => {
        const url = AppConfig.API_ENDPOINT + '/auth/token';
        const params = 'refresh_token=' + refreshToken;

        const headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        this.http.post(url, params, {
          headers
        }).subscribe(res => {
          const data = res.json();
          this.storage.set('id_token', data.token);
          localStorage.setItem('id_token', data.token);
          resolve();
        }, (error: Response) => {
          if (error.status === 401) {
            this.storage.remove('refresh_token');
            reject(true);
          } else {
            reject(false);
          }
        });
      }).catch(error => {
        reject();
      });
    });
  }
}
