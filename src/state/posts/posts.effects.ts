import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../';
import { ApiService } from '../../services/api/api';
import * as topic from '../topics/topics.actions';
import * as post from './posts.actions';
import * as fromPost from './posts.reducer';

@Injectable()
export class PostEffects {

  @Effect()
  load$: Observable<Action> = this.actions$
    .ofType(post.ActionTypes.LOAD)
    .map((action: post.LoadAction) => action.payload)
    .withLatestFrom(this.store$.select(fromRoot.getSelectedTopicPostsLength), this.store$.select(fromRoot.getSelectedTopic))
    .switchMap(([{ topicId, reset }, length, selectedTopic]) => {
      const unread = selectedTopic ? selectedTopic.ongelezen : 0;
      const offset = reset ? 0 : (length || 0);
      const limit = getLimit(unread, fromPost.POSTS_PER_LOAD);
      return this.api.getForumTopic(topicId, offset, limit)
        .map(posts => new post.LoadCompleteAction({ topicId, posts, reset }));
    });

  @Effect()
  loadComplete$: Observable<Action> = this.actions$
    .ofType(post.ActionTypes.LOAD_COMPLETE)
    .map((action: post.LoadCompleteAction) => action.payload)
    .map(({ topicId, posts }) => new topic.ReadAction(topicId));

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
