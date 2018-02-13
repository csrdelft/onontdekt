import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';

import * as fromRoot from '../';
import { ApiService } from '../../services/api.service';
import * as post from '../posts/posts.actions';
import * as topic from './topics.actions';
import * as fromTopic from './topics.reducer';

@Injectable()
export class TopicEffects {

  @Effect()
  load$ = this.actions$.pipe(
    ofType<topic.LoadAction>(topic.LOAD),
    map(action => action.payload),
    withLatestFrom(this.store$.pipe(select(fromRoot.getTopicsLength))),
    switchMap(([reset, length]) => {
      const offset = reset ? 0 : length;
      const limit = fromTopic.TOPICS_PER_LOAD;
      return this.api.getForumRecent(offset, limit).pipe(
        map(response => response.data),
        map(topics => new topic.LoadCompleteAction({ reset, topics }))
      );
    })
  );

  @Effect()
  select$ = this.actions$.pipe(
    ofType(topic.SELECT),
    map((action: topic.SelectAction) => action.payload),
    withLatestFrom(
      this.store$.pipe(select(fromRoot.getSelectedTopicPostsAll)),
      this.store$.pipe(select(fromRoot.getSelectedTopic))
    ),
    filter(([topicId, posts, selectedTopic]) => {
      if (!posts || posts.length === 0) {
        return true;
      }
      if (selectedTopic && selectedTopic.ongelezen > 0) {
        return true;
      }
      return false;
    }),
    map(([topicId, posts, selectedTopic]) => new post.LoadAction({ topicId, reset: true }))
  );

  constructor(
    private actions$: Actions,
    private api: ApiService,
    private store$: Store<fromRoot.State>
  ) {}
}
