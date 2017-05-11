import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../';
import { ApiService } from '../../services/api/api';
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

  constructor(
    private actions$: Actions,
    private api: ApiService,
    private store$: Store<fromRoot.State>
  ) {}
}
