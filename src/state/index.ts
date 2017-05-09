import { createSelector } from 'reselect';
import { compose } from '@ngrx/core/compose';
import { ActionReducer, combineReducers } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';

import { AppConfig } from '../app/app.config';

import * as fromMembers from './members/members.reducer';
import * as fromPosts from './posts/posts.reducer';
import * as fromTopics from './topics/topics.reducer';

// These imports are somehow needed or the ts compiler throws
import { Member, MemberDetail } from './members/members.model';
import { ForumPost } from './posts/posts.model';
import { ForumTopic } from './topics/topics.model';
export interface Unused {
  a: Member;
  b: MemberDetail;
  c: ForumPost;
  d: ForumTopic;
}

/**
 * Merge sub states
 */
export interface State {
  members: fromMembers.State;
  posts: fromPosts.State;
  topics: fromTopics.State;
}

/**
 * Merge sub reducers
 */
const reducers = {
  members: fromMembers.reducer,
  posts: fromPosts.reducer,
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
 * Map Posts selectors to main state
 */
export const getPostsState = (state: State) => state.posts;

export const getPostEntities = createSelector(getPostsState, fromPosts.getEntities);
export const getPostsByTopic = createSelector(getPostsState, fromPosts.getByTopic);

/**
 * Map Topics selectors to main state
 */
export const getTopicsState = (state: State) => state.topics;

export const getAllTopics = createSelector(getTopicsState, fromTopics.getAll);
export const getSelectedTopicId = createSelector(getTopicsState, fromTopics.getSelectedId);
export const getSelectedTopic = createSelector(getTopicsState, fromTopics.getSelected);
export const moreTopicsAvailable = createSelector(getTopicsState, fromTopics.isMoreAvailable);
export const getTopicsLength = createSelector(getTopicsState, fromTopics.getLength);

/**
 * Shared Posts and Topics selectors
 */
export const getSelectedTopicPosts = createSelector(getSelectedTopicId, getPostsByTopic, (topicId, posts) => {
  return posts[topicId];
});

export const getSelectedTopicPostIds = createSelector(getSelectedTopicPosts, (posts) => {
  return posts && posts.ids;
});

export const getSelectedTopicPostsAll = createSelector(getSelectedTopicPostIds, getPostEntities, (ids, entities) => {
  return ids && ids.map(id => entities[id]);
});

export const getSelectedTopicPostsLength = createSelector(getSelectedTopicPostIds, (postIds) => {
  return postIds && postIds.length;
});

export const getSelectedTopicMorePostsAvailable = createSelector(getSelectedTopicPosts, (posts) => {
  return posts && posts.isMoreAvailable;
});
