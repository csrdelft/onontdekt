import { Action } from '@ngrx/store';

import { Member, MemberDetail } from './members.model';

// tslint:disable:max-classes-per-file

export const LOAD_ALL = '[Members] Load All';
export const LOAD_ALL_COMPLETE = '[Members] Load All Complete';
export const LOAD = '[Members] Load';
export const SELECT = '[Members] Select';
export const SEARCH = '[Members] Search';

export class LoadAllAction implements Action {
  readonly type = LOAD_ALL;
}

export class LoadAllCompleteAction implements Action {
  readonly type = LOAD_ALL_COMPLETE;

  constructor(public payload: Member[]) {}
}

export class LoadAction implements Action {
  readonly type = LOAD;

  constructor(public payload: MemberDetail) {}
}

export class SelectAction implements Action {
  readonly type = SELECT;

  constructor(public payload: string) {}
}

export class SearchAction implements Action {
  readonly type = SEARCH;

  constructor(public payload: string) {}
}

export type Actions =
  | LoadAllAction
  | LoadAllCompleteAction
  | LoadAction
  | SelectAction
  | SearchAction;
