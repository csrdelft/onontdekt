import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector
} from '@ngrx/store';

import * as fromAuth from './auth/auth.reducer';
import * as fromMembers from './members/members.reducer';
import * as fromPosts from './posts/posts.reducer';
import * as fromTopics from './topics/topics.reducer';

/**
 * Merge sub states
 */
export interface State {
  auth: fromAuth.State;
  members: fromMembers.State;
  posts: fromPosts.State;
  topics: fromTopics.State;
}

/**
 * Merge sub reducers
 */
export const reducers: ActionReducerMap<State> = {
  auth: fromAuth.reducer,
  members: fromMembers.reducer,
  posts: fromPosts.reducer,
  topics: fromTopics.reducer
};

/**
 * Map Auth selectors to main state
 */
export const getAuthState = createFeatureSelector<fromAuth.State>('auth');

export const getAuthenticated = createSelector(
  getAuthState,
  fromAuth.getAuthenticated
);
export const getRefreshing = createSelector(
  getAuthState,
  fromAuth.getRefreshing
);
export const getTokens = createSelector(getAuthState, fromAuth.getTokens);
export const getIdentity = createSelector(getAuthState, fromAuth.getIdentity);
export const getUserId = createSelector(getAuthState, fromAuth.selectUserId);

/**
 * Map Members selectors to main state
 */
export const getMembersState = createFeatureSelector<fromMembers.State>(
  'members'
);

export const getAllMembers = createSelector(
  getMembersState,
  fromMembers.getAll
);
export const getMembersQuery = createSelector(
  getMembersState,
  fromMembers.getQuery
);
export const getMembersQueryResults = createSelector(
  getMembersState,
  fromMembers.getQueryResults
);
export const getSelectedMember = createSelector(
  getMembersState,
  fromMembers.getSelected
);
export const getSelectedMemberDetail = createSelector(
  getMembersState,
  fromMembers.getSelectedDetail
);

/**
 * Map Posts selectors to main state
 */
export const getPostsState = createFeatureSelector<fromPosts.State>('posts');

export const getPostEntities = createSelector(
  getPostsState,
  fromPosts.getEntities
);
export const getPostsByTopic = createSelector(
  getPostsState,
  fromPosts.getByTopic
);

/**
 * Map Topics selectors to main state
 */
export const getTopicsState = createFeatureSelector<fromTopics.State>('topics');

export const getAllTopics = createSelector(getTopicsState, fromTopics.getAll);
export const getSelectedTopicId = createSelector(
  getTopicsState,
  fromTopics.getSelectedId
);
export const getSelectedTopic = createSelector(
  getTopicsState,
  fromTopics.getSelected
);
export const moreTopicsAvailable = createSelector(
  getTopicsState,
  fromTopics.isMoreAvailable
);
export const getTopicsLength = createSelector(
  getTopicsState,
  fromTopics.getLength
);

/**
 * Shared Posts and Topics selectors
 */
export const getSelectedTopicPosts = createSelector(
  getSelectedTopicId,
  getPostsByTopic,
  (topicId, posts) => {
    return topicId && posts[topicId];
  }
);

export const getSelectedTopicPostIds = createSelector(
  getSelectedTopicPosts,
  posts => {
    return posts && posts.ids;
  }
);

export const getSelectedTopicPostsAll = createSelector(
  getSelectedTopicPostIds,
  getPostEntities,
  (ids, entities) => {
    return (ids && ids.map(id => entities[id])) || null;
  }
);

export const getSelectedTopicPostsLength = createSelector(
  getSelectedTopicPostIds,
  postIds => {
    return postIds && postIds.length;
  }
);

export const getSelectedTopicMorePostsAvailable = createSelector(
  getSelectedTopicPosts,
  posts => {
    return (posts && posts.isMoreAvailable) || null;
  }
);
