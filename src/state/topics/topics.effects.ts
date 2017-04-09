import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { ApiService } from '../../providers/api';
import * as fromRoot from '../';
import * as topic from './topics.actions';
import * as fromTopic from './topics.reducer';

@Injectable()
export class TopicEffects {

  @Effect()
  load$: Observable<Action> = this.actions$
    .ofType(topic.ActionTypes.LOAD)
    .map((action: topic.LoadAction) => action.payload)
    .withLatestFrom(this.store$.select(fromRoot.getTopicsLength))
    .switchMap(([reset, length]) => {
      const offset = reset ? 0 : length;
      const limit = fromTopic.TOPICS_PER_LOAD;
      return this.api.getForumRecent(offset, limit)
        .map(topics => new topic.LoadCompleteAction({ reset, topics }));
    });

  // @Effect()
  // select$: Observable<Action> = this.actions$
  //   .ofType(member.ActionTypes.SELECT)
  //   .map(toPayload)
  //   .switchMap((id: string) => {
  //     return this.api.getMemberDetail(id)
  //       .map(detail => new member.LoadAction(detail));
  //   });

  constructor(
    private actions$: Actions,
    private api: ApiService,
    private store$: Store<fromRoot.State>
  ) {}
}
