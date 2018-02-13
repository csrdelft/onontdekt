import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import * as jwt_decode from 'jwt-decode';
import { forkJoin } from 'rxjs/observable/forkJoin';
import {
  exhaustMap,
  map,
  mergeMap,
  switchMap,
  tap
} from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import * as auth from './auth.actions';
import { AccessTokenPayload, Tokens } from './auth.model';

@Injectable()
export class AuthEffects {
  @Effect()
  init$ = this.actions$.pipe(
    ofType(ROOT_EFFECTS_INIT),
    map(() => new auth.Initialize())
  );

  @Effect()
  initialize$ = this.actions$.pipe(
    ofType<auth.Initialize>(auth.INITIALIZE),
    switchMap(() => forkJoin(
      this.storage.get('id_token'),
      this.storage.get('refresh_token')
    )),
    map(([token, refreshToken]) => !!token && !!refreshToken ? {
      token,
      refreshToken
    } : undefined),
    mergeMap(
      (tokens?: Tokens) =>
        !!tokens
          ? [new auth.SetAuthenticated(true), new auth.SetTokens(tokens)]
          : [new auth.SetAuthenticated(false)]
    )
  );

  @Effect({ dispatch: false })
  refresh$ = this.actions$.pipe(
    ofType<auth.Refresh>(auth.REFRESH),
    map(action => action.payload),
    exhaustMap(refreshToken => this.authService.refresh(refreshToken))
  );

  @Effect()
  setTokens$ = this.actions$.pipe(
    ofType<auth.SetTokens>(auth.SET_TOKENS),
    map(action => action.payload),
    tap(tokens => {
      this.storage.set('id_token', tokens.token);
      this.storage.set('refresh_token', tokens.refreshToken);
    }),
    map(tokens => jwt_decode<AccessTokenPayload>(tokens.token)),
    map(tokenPayload => new auth.SetIdentity(tokenPayload.data))
  );

  @Effect()
  logout$ = this.actions$.pipe(
    ofType<auth.Logout>(auth.LOGOUT),
    tap(() => {
      this.storage.remove('userId');
      this.storage.remove('id_token');
      this.storage.remove('refresh_token');
    }),
    map(() => new auth.SetAuthenticated(false))
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private storage: Storage
  ) {}
}
