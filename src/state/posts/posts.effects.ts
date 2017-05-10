import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../';
import { ApiService } from '../../providers/api';
import * as post from './posts.actions';
import * as fromPost from './posts.reducer';

@Injectable()
export class PostEffects {

  @Effect()
  load$: Observable<Action> = this.actions$
    .ofType(post.ActionTypes.LOAD)
    .map((action: post.LoadAction) => action.payload)
    .withLatestFrom(this.store$.select(fromRoot.getSelectedTopicPostsLength))
    .switchMap(([topicId, length]) => {
      const offset = length || 0;
      const limit = fromPost.POSTS_PER_LOAD;
      return this.api.getForumTopic(topicId, offset, limit)
        .map(posts => new post.LoadCompleteAction({ topicId, posts }));
    });

  constructor(
    private actions$: Actions,
    private api: ApiService,
    private store$: Store<fromRoot.State>
  ) {}
}
