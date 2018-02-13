import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as jwt_decode from 'jwt-decode';
import { of } from 'rxjs/observable/of';
import { first, map, switchMap } from 'rxjs/operators';

import * as fromRoot from '../state';
import * as auth from '../state/auth/auth.actions';
import { AccessTokenPayload, Tokens } from '../state/auth/auth.model';

@Injectable()
export class JwtService {
  constructor(private store: Store<fromRoot.State>) {}

  getValidTokens() {
    return this.getCurrentTokens().pipe(
      switchMap(tokens => this.checkExpiration(tokens!)),
      map(tokens => tokens!)
    );
  }

  isTokenExpired(token: string, offsetSeconds = 10) {
    const decoded = jwt_decode<AccessTokenPayload>(token);
    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);

    return !(date.valueOf() > new Date().valueOf() + offsetSeconds * 1000);
  }

  private getCurrentTokens() {
    return this.store.pipe(
      select(fromRoot.getRefreshing),
      first(refreshing => refreshing === false),
      switchMap(refreshed =>
        this.store.pipe(select(fromRoot.getTokens), first())
      )
    );
  }

  private checkExpiration(tokens: Tokens) {
    const expired = this.isTokenExpired(tokens.token);
    if (!expired) {
      return of(tokens);
    }

    this.store.dispatch(new auth.Refresh(tokens.refreshToken));
    return this.getCurrentTokens();
  }
}
