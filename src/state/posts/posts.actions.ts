import { Action } from '@ngrx/store';

import { ForumPost } from './posts.model';

// tslint:disable:max-classes-per-file

export const LOAD               = '[Posts] Load';
export const LOAD_COMPLETE      = '[Posts] Load Complete';

export class LoadAction implements Action {
  readonly type = LOAD;

  constructor(public payload: { topicId: number; reset: boolean; }) {}
}

export class LoadCompleteAction implements Action {
  readonly type = LOAD_COMPLETE;

  constructor(public payload: { topicId: number; posts: ForumPost[]; reset: boolean; }) {}
}

export type Actions
  = LoadAction
  | LoadCompleteAction;
