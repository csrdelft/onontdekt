import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { AppConfig } from '../app/app.config';
import { parseJsonDates } from '../util/data';

@Injectable()
export class DateInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!request.url.startsWith(AppConfig.ENV.apiEndpoint)) {
      return next.handle(request);
    }

    return next.handle(request).pipe(map(event => this.handleEvent(event)));
  }

  private handleEvent(event: HttpEvent<any>) {
    if (!(event instanceof HttpResponse) || !event.body) {
      return event;
    }

    const body = parseJsonDates(event.body);
    return event.clone({ body });
  }
}
