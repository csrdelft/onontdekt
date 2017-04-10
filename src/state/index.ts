import { createSelector } from 'reselect';
import { compose } from '@ngrx/core/compose';
import { ActionReducer, combineReducers } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';

import { AppConfig } from '../app/app.config';

import * as fromMembers from './members/members.reducer';
import * as fromTopics from './topics/topics.reducer';

/**
 * Merge sub states
 */
export interface State {
  members: fromMembers.State;
  topics: fromTopics.State;
}

/**
 * Merge sub reducers
 */
const reducers = {
  members: fromMembers.reducer,
  topics: fromTopics.reducer,
};

const developmentReducer: ActionReducer<State> = compose(storeFreeze, combineReducers)(reducers);
const productionReducer: ActionReducer<State> = combineReducers(reducers);

export function reducer(state: any, action: any) {
  if (AppConfig.IS_DEV) {
    return productionReducer(state, action);
  } else {
    return developmentReducer(state, action);
  }
}

/**
 * Map Members selectors to main state
 */
export const getMembersState = (state: State) => state.members;

export const getAllMembers = createSelector(getMembersState, fromMembers.getAll);
export const getMembersQuery = createSelector(getMembersState, fromMembers.getQuery);
export const getMembersQueryResults = createSelector(getMembersState, fromMembers.getQueryResults);
export const getSelectedMember = createSelector(getMembersState, fromMembers.getSelected);
export const getSelectedMemberDetail = createSelector(getMembersState, fromMembers.getSelectedDetail);

/**
 * Map Topics selectors to main state
 */
export const getTopicsState = (state: State) => state.topics;

export const getAllTopics = createSelector(getTopicsState, fromTopics.getAll);
export const getSelectedTopic = createSelector(getTopicsState, fromTopics.getSelected);
export const moreTopicsAvailable = createSelector(getTopicsState, fromTopics.isMoreAvailable);
export const getTopicsLength = createSelector(getTopicsState, fromTopics.getLength);
