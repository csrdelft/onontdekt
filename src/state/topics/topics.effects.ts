import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import * as fromRoot from '../';
import { ApiService } from '../../services/api/api';
import * as post from '../posts/posts.actions';
import * as topic from './topics.actions';
import * as fromTopic from './topics.reducer';

@Injectable()
export class TopicEffects {

  @Effect()
  load$ = this.actions$
    .ofType(topic.LOAD)
    .map((action: topic.LoadAction) => action.payload)
    .withLatestFrom(this.store$.select(fromRoot.getTopicsLength))
    .switchMap(([reset, length]) => {
      const offset = reset ? 0 : length;
      const limit = fromTopic.TOPICS_PER_LOAD;
      return this.api.getForumRecent(offset, limit)
        .map(topics => new topic.LoadCompleteAction({ reset, topics }));
    });

  @Effect()
  select$ = this.actions$
    .ofType(topic.SELECT)
    .map((action: topic.SelectAction) => action.payload)
    .withLatestFrom(this.store$.select(fromRoot.getSelectedTopicPostsAll), this.store$.select(fromRoot.getSelectedTopic))
    .filter(([topicId, posts, selectedTopic]) => {
      if (!posts || posts.length === 0) {
        return true;
      }
      if (selectedTopic && selectedTopic.ongelezen > 0) {
        return true;
      }
      return false;
    })
    .map(([topicId, posts, selectedTopic]) => new post.LoadAction({ topicId, reset: true }));

  constructor(
    private actions$: Actions,
    private api: ApiService,
    private store$: Store<fromRoot.State>
  ) {}
}
