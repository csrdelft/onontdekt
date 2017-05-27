import { Action } from '@ngrx/store';

import { type } from '../../util/state';
import { ForumPost } from './posts.model';

// tslint:disable:max-classes-per-file

export class ActionTypes {
  static readonly LOAD               = type('[Posts] Load');
  static readonly LOAD_COMPLETE      = type('[Posts] Load Complete');
}

export class LoadAction implements Action {
  readonly type = ActionTypes.LOAD;

  constructor(public payload: { topicId: number; reset: boolean; }) { }
}

export class LoadCompleteAction implements Action {
  readonly type = ActionTypes.LOAD_COMPLETE;

  constructor(public payload: { topicId: number; posts: ForumPost[]; reset: boolean; }) { }
}

export type Actions
  = LoadAction
  | LoadCompleteAction;
