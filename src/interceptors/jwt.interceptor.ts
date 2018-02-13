import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map, switchMap } from 'rxjs/operators';

import { AppConfig } from '../app/app.config';
import { authPath } from '../services/auth.service';
import { JwtService } from '../services/jwt.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private jwtService: JwtService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.toExternalDomain(request) || request.url.startsWith(authPath)) {
      return next.handle(request);
    }

    return this.jwtService
      .getValidTokens()
      .pipe(
        map(tokens => this.setHeader(request, tokens.token)),
        switchMap(authRequest => next.handle(authRequest))
      );
  }

  private setHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        'X-Csr-Authorization': `Bearer ${token}`
      }
    });
  }

  private toExternalDomain(request: HttpRequest<any>) {
    try {
      const requestUrl = new URL(request.url);
      return !!requestUrl && !request.url.startsWith(AppConfig.ENV.apiEndpoint);
    } catch (e) {
      // if we're here, the request is made to the same domain as the Angular app so it's safe to proceed
      return false;
    }
  }
}
