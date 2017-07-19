import { Action } from '@ngrx/store';

import { ForumTopic } from './topics.model';

// tslint:disable:max-classes-per-file

export const LOAD               = '[Topics] Load';
export const LOAD_COMPLETE      = '[Topics] Load Complete';
export const SELECT             = '[Topics] Select';
export const READ               = '[Topics] Read';

export class LoadAction implements Action {
  readonly type = LOAD;

  constructor(public payload: boolean) { }
}

export class LoadCompleteAction implements Action {
  readonly type = LOAD_COMPLETE;

  constructor(public payload: { reset: boolean; topics: ForumTopic[] }) { }
}

export class SelectAction implements Action {
  readonly type = SELECT;

  constructor(public payload: number) { }
}

export class ReadAction implements Action {
  readonly type = READ;

  constructor(public payload: number) { }
}

export type Actions
  = LoadAction
  | LoadCompleteAction
  | SelectAction
  | ReadAction;
