import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { AuthHttp, JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GoogleAnalytics } from 'ionic-native';
import { Observable } from 'rxjs/Observable';
import { Push } from '@ionic/cloud-angular';

import { AppSettings } from '../constants/app-settings';


@Injectable()
export class AuthService {
  private jwtHelper: JwtHelper = new JwtHelper();
  private refreshSubscription: any;
  private userId: string;

  constructor(
    private http: Http,
    private authHttp: AuthHttp,
    private platform: Platform,
    private push: Push,
    private storage: Storage
  ) {
    this.storage.get('userId').then((userId: string) => {
      if (userId) {
        this.userId = userId;
        this.registerLogin('Automatic');
      }
    });
  }

  public tryAuthentication(): Promise<boolean> {
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

  public login(username: string, password: string): Promise<any> {
    let url = AppSettings.API_ENDPOINT + '/auth/authorize';
    let params = 'user=' + username + '&pass=' + password;

    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return new Promise((resolve, reject) => {
      this.http.post(url, params, {
        headers: headers
      }).subscribe(res => {
        let data = res.json();
        this.userId = username;
        this.storage.set('userId', this.userId);
        this.storage.set('id_token', data.token);
        localStorage.setItem('id_token', data.token);
        this.storage.set('refresh_token', data.refreshToken);
        this.scheduleRefresh();
        this.registerLogin('Manual');
        resolve();
      }, error => {
        reject(error);
      });
    });
  }

  public logout(reload: boolean = false) {
    this.storage.remove('userId');
    this.userId = null;
    this.storage.remove('id_token');
    localStorage.removeItem('id_token');
    this.storage.remove('refresh_token');
    this.unscheduleRefresh();
    this.registerLogout(reload ? 'Automatic' : 'Manual');

    if (reload) {
      location.reload();
    }
  }

  private registerLogin(type: string) {
    if (this.platform.is('cordova')) {
      this.push.register().then((token) => {
        this.push.saveToken(token);
      });
      this.platform.ready().then(() => {
        GoogleAnalytics.trackEvent('Authorization', 'Login', type);
      });
    }
  }

  private registerLogout(type: string) {
    if (this.platform.is('cordova')) {
      this.push.unregister();
      this.platform.ready().then(() => {
        GoogleAnalytics.trackEvent('Authorization', 'Logout', type);
      });
    }
  }

  private authenticated(): boolean {
    return tokenNotExpired();
  }

  private hasRefreshToken(): Promise<boolean> {
    return this.storage.get('refresh_token').then((value: string) => {
      return !!value;
    });
  }

  private getToken(): Promise<string> {
    return this.storage.get('id_token');
  }

  private scheduleRefresh() {
    let source = this.authHttp.tokenStream.flatMap((token: string) => {
      let jwtIat: number = this.jwtHelper.decodeToken(token).iat;
      let jwtExp: number = this.jwtHelper.decodeToken(token).exp;
      let iat: Date = new Date(0);
      let exp: Date = new Date(0);
      let delay: number = (exp.setUTCSeconds(jwtExp) - iat.setUTCSeconds(jwtIat));

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
    let source = this.authHttp.tokenStream.flatMap((token: string) => {
      let now: number = new Date().valueOf();
      let jwtExp: number = this.jwtHelper.decodeToken(token).exp;
      let exp: Date = new Date(0);
      exp.setUTCSeconds(jwtExp);
      let delay: number = exp.valueOf() - now;

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
        let url = AppSettings.API_ENDPOINT + '/auth/token';
        let params = 'refresh_token=' + refreshToken;

        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        this.http.post(url, params, {
          headers: headers
        }).subscribe(res => {
          let data = res.json();
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
