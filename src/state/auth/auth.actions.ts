import { Action } from '@ngrx/store';

import { Identity, Tokens } from './auth.model';

// tslint:disable:max-classes-per-file

export const INITIALIZE = '[Auth] Initialize';
export const REFRESH = '[Auth] Refresh';
export const SET_AUTHENTICATED = '[Auth] Set Authenticated';
export const SET_TOKENS = '[Auth] Set Tokens';
export const SET_IDENTITY = '[Auth] Set Identity';
export const LOGOUT = '[Auth] Logout';

export class Initialize implements Action {
  readonly type = INITIALIZE;
}

export class Refresh implements Action {
  readonly type = REFRESH;

  constructor(public payload: string) {}
}

export class SetAuthenticated implements Action {
  readonly type = SET_AUTHENTICATED;

  constructor(public payload: boolean) {}
}

export class SetTokens implements Action {
  readonly type = SET_TOKENS;

  constructor(public payload: Tokens) {}
}

export class SetIdentity implements Action {
  readonly type = SET_IDENTITY;

  constructor(public payload: Identity) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export type Actions =
  | Initialize
  | Refresh
  | SetAuthenticated
  | SetTokens
  | SetIdentity
  | Logout;
