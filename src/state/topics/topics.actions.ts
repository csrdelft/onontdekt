import { Action } from '@ngrx/store';

import { type } from '../../util/state';
import { ForumTopic } from './topics.model';

// tslint:disable:max-classes-per-file

export class ActionTypes {
  static readonly LOAD               = type('[Topics] Load');
  static readonly LOAD_COMPLETE      = type('[Topics] Load Complete');
  static readonly SELECT             = type('[Topics] Select');
}

export class LoadAction implements Action {
  readonly type = ActionTypes.LOAD;

  constructor(public payload: boolean) { }
}

export class LoadCompleteAction implements Action {
  readonly type = ActionTypes.LOAD_COMPLETE;

  constructor(public payload: { reset: boolean; topics: ForumTopic[] }) { }
}

export class SelectAction implements Action {
  readonly type = ActionTypes.SELECT;

  constructor(public payload: number) { }
}

export type Actions
  = LoadAction
  | LoadCompleteAction
  | SelectAction;
