import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AppConfig } from '../app/app.config';
import { Credentials, RefreshResponse, Tokens } from '../state/auth/auth.model';

// The jwt interceptor requires this path, but cannot depend on AuthService
// due to its http dependency, so we export it separately.
// https://github.com/angular/angular/issues/18224
export const authPath = `${AppConfig.ENV.apiEndpoint}/auth`;

@Injectable()
export class AuthService {
  path = authPath;
  userId?: string;

  constructor(private http: HttpClient) {}

  login({ username, password }: Credentials) {
    this.userId = username;

    const method = 'post';
    const url = `${this.path}/authorize`;
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );
    const params = new HttpParams().set('user', username).set('pass', password);
    const body = params.toString();

    return this.http.request<Tokens>(method, url, { headers, body });
  }

  refresh(refreshToken: string) {
    const method = 'post';
    const url = `${this.path}/token`;
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );
    const params = new HttpParams().set('refresh_token', refreshToken);
    const body = params.toString();

    return this.http.request<RefreshResponse>(method, url, { headers, body });
  }

  isDemo() {
    return this.userId === 'x037';
  }
}
