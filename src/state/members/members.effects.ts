import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { exhaustMap, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';

import * as fromRoot from '../';
import { ApiService } from '../../services/api.service';
import * as member from './members.actions';

@Injectable()
export class MemberEffects {

  @Effect()
  loadAll$ = this.actions$.pipe(
    ofType(member.LOAD_ALL),
    withLatestFrom(this.store$.pipe(select(fromRoot.getAllMembers))),
    filter(([action, state]) => state.length === 0),
    exhaustMap(() =>
      this.api.getMemberList().pipe(
        map(response => response.data),
        map(list => new member.LoadAllCompleteAction(list))
      )
    )
  );

  @Effect()
  select$ = this.actions$.pipe(
    ofType(member.SELECT),
    map((action: member.SelectAction) => action.payload),
    withLatestFrom(this.store$.select(fromRoot.getSelectedMemberDetail)),
    filter(([id, selected]) => !selected),
    switchMap(([id, selected]) => {
      return this.api.getMemberDetail(id).pipe(
        map(response => response.data),
        map(detail => new member.LoadAction(detail))
      );
    })
  );

  constructor(
    private actions$: Actions,
    private api: ApiService,
    private store$: Store<fromRoot.State>
  ) {}
}
