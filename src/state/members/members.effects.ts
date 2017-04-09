import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../../providers/api';
import * as member from './members.actions';

@Injectable()
export class MemberEffects {

  @Effect()
  loadAll$: Observable<Action> = this.actions$
    .ofType(member.ActionTypes.LOAD_ALL)
    .switchMap(() => {
      return this.api.getMemberList()
        .map(list => new member.LoadAllCompleteAction(list));
    });

  @Effect()
  select$: Observable<Action> = this.actions$
    .ofType(member.ActionTypes.SELECT)
    .map((action: member.SelectAction) => action.payload)
    .switchMap(id => {
      return this.api.getMemberDetail(id)
        .map(detail => new member.LoadAction(detail));
    });

  constructor(
    private actions$: Actions,
    private api: ApiService
  ) {}
}
