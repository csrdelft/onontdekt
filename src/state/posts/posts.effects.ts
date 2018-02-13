import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';

import * as fromRoot from '../';
import { ApiService } from '../../services/api.service';
import * as topic from '../topics/topics.actions';
import * as post from './posts.actions';
import * as fromPost from './posts.reducer';

@Injectable()
export class PostEffects {
  @Effect()
  load$ = this.actions$.pipe(
    ofType<post.LoadAction>(post.LOAD),
    map(action => action.payload),
    withLatestFrom(
      this.store$.pipe(select(fromRoot.getSelectedTopicPostsLength)),
      this.store$.pipe(select(fromRoot.getSelectedTopic))
    ),
    switchMap(([{ topicId, reset }, length, selectedTopic]) => {
      const unread = selectedTopic ? selectedTopic.ongelezen : 0;
      const offset = reset ? 0 : length || 0;
      const limit = getLimit(unread, fromPost.POSTS_PER_LOAD);

      return this.api
        .getForumTopic(topicId, offset, limit)
        .pipe(
          map(response => response.data),
          map(posts => new post.LoadCompleteAction({ topicId, posts, reset }))
        );
    })
  );

  @Effect()
  loadComplete$ = this.actions$.pipe(
    ofType<post.LoadCompleteAction>(post.LOAD_COMPLETE),
    map(action => action.payload),
    map(({ topicId, posts }) => new topic.ReadAction(topicId))
  );

  constructor(
    private actions$: Actions,
    private api: ApiService,
    private store$: Store<fromRoot.State>
  ) {}
}

function getLimit(unread: number, limit: number) {
  if (unread > limit - 3) {
    return unread + 3;
  } else {
    return limit;
  }
}
