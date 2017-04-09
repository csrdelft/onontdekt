import { Injectable } from '@angular/core';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/Observable/of';

import { ApiService } from '../../providers/api';
import * as member from './members.actions';

@Injectable()
export class MemberEffects {

  @Effect()
  loadAll$: Observable<Action> = this.actions$
    .ofType(member.ActionTypes.LOAD_ALL)
    .switchMap(() => {
      return this.api.getMemberList()
        .map(list => new member.LoadAllCompleteAction(list))
        .catch(() => of(new member.LoadAllCompleteAction([])));
    });

  @Effect()
  select$: Observable<Action> = this.actions$
    .ofType(member.ActionTypes.SELECT)
    .map(toPayload)
    .switchMap((id: string) => {
      return this.api.getMemberDetail(id)
        .map(detail => new member.LoadAction(detail))
        .catch(() => of(new member.LoadAction(null)));
    });

  constructor(
    private actions$: Actions,
    private api: ApiService
  ) {}
}
