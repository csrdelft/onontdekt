import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../';
import { ApiService } from '../../providers/api';
import * as member from './members.actions';

@Injectable()
export class MemberEffects {

  @Effect()
  loadAll$: Observable<Action> = this.actions$
    .ofType(member.ActionTypes.LOAD_ALL)
    .withLatestFrom(this.store$.select(fromRoot.getAllMembers))
    .filter(([action, state]) => state.length === 0)
    .switchMap(() => {
      return this.api.getMemberList()
        .map(list => new member.LoadAllCompleteAction(list));
    });

  @Effect()
  select$: Observable<Action> = this.actions$
    .ofType(member.ActionTypes.SELECT)
    .map((action: member.SelectAction) => action.payload)
    .withLatestFrom(this.store$.select(fromRoot.getSelectedMemberDetail))
    .filter(([id, selected]) => !selected)
    .switchMap(([id, selected]) => {
      return this.api.getMemberDetail(id)
        .map(detail => new member.LoadAction(detail));
    });

  constructor(
    private actions$: Actions,
    private api: ApiService,
    private store$: Store<fromRoot.State>
  ) {}
}
