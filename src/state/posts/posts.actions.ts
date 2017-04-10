import { Action } from '@ngrx/store';

import { ForumPost } from './posts.model';
import { type } from '../../util/state';

export class ActionTypes {
  static readonly LOAD               = type('[Posts] Load');
  static readonly LOAD_COMPLETE      = type('[Posts] Load Complete');
};

export class LoadAction implements Action {
  readonly type = ActionTypes.LOAD;

  constructor(public payload: number) { }
}

export class LoadCompleteAction implements Action {
  readonly type = ActionTypes.LOAD_COMPLETE;

  constructor(public payload: { topicId: number; posts: ForumPost[]; }) { }
}

export type Actions
  = LoadAction
  | LoadCompleteAction;
