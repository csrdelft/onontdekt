import { createSelector } from '@ngrx/store';

import * as auth from './auth.actions';
import { Identity, Tokens } from './auth.model';

export interface State {
  readonly authenticated?: boolean;
  readonly refreshing: boolean;
  readonly tokens?: Tokens;
  readonly identity?: Identity;
}

export const initialState: State = {
  authenticated: undefined,
  refreshing: false,
  tokens: undefined,
  identity: undefined
};

export function reducer(state = initialState, action: auth.Actions): State {
  switch (action.type) {
    case auth.REFRESH: {
      return {
        ...state,
        refreshing: true
      };
    }

    case auth.SET_AUTHENTICATED: {
      return {
        ...state,
        authenticated: action.payload
      };
    }

    case auth.SET_TOKENS: {
      return {
        ...state,
        refreshing: false,
        tokens: action.payload
      };
    }

    case auth.SET_IDENTITY: {
      return {
        ...state,
        identity: action.payload
      };
    }

    case auth.LOGOUT: {
      return {
        ...initialState,
        authenticated: false
      };
    }

    default: {
      return state;
    }
  }
}

export const getAuthenticated = (state: State) => state.authenticated;
export const getRefreshing = (state: State) => state.refreshing;
export const getTokens = (state: State) => state.tokens;
export const getIdentity = (state: State) => state.identity;

export const selectUserId = createSelector(
  getIdentity,
  identity => identity && identity.userId
);
