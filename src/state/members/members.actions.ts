import { Action } from '@ngrx/store';

import { Member, MemberDetail } from './members.model';
import { type } from '../../util/state';

export class ActionTypes {
  static readonly LOAD_ALL          = type('[Members] Load All');
  static readonly LOAD_ALL_COMPLETE = type('[Members] Load All Complete');
  static readonly LOAD              = type('[Members] Load');
  static readonly SELECT            = type('[Members] Select');
  static readonly SEARCH            = type('[Members] Search');
};

export class LoadAllAction implements Action {
  readonly type = ActionTypes.LOAD_ALL;
}

export class LoadAllCompleteAction implements Action {
  readonly type = ActionTypes.LOAD_ALL_COMPLETE;

  constructor(public payload: Member[]) { }
}

export class LoadAction implements Action {
  readonly type = ActionTypes.LOAD;

  constructor(public payload: MemberDetail) { }
}

export class SelectAction implements Action {
  readonly type = ActionTypes.SELECT;

  constructor(public payload: string) { }
}

export class SearchAction implements Action {
  readonly type = ActionTypes.SEARCH;

  constructor(public payload: string) { }
}

export type Actions
  = LoadAllAction
  | LoadAllCompleteAction
  | LoadAction
  | SelectAction
  | SearchAction;
