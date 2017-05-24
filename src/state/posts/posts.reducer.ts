import * as post from './posts.actions';
import { ForumPost } from './posts.model';

export interface State {
  entities: { [id: number]: ForumPost };
  byTopic: {
    [topicId: number]: {
      ids: number[];
      isMoreAvailable: boolean;
    };
  };
}

export const initialState: State = {
  entities: {},
  byTopic: {}
};

export const POSTS_PER_LOAD = 10;

export function reducer(state = initialState, action: post.Actions): State {
  switch (action.type) {
    case post.ActionTypes.LOAD_COMPLETE: {
      const topicId = action.payload.topicId;
      const posts = action.payload.posts;
      const postIds = posts.map(post => post.post_id);
      const postEntities = posts.reduce((entities: { [id: number]: ForumPost }, post) => {
        return { ...entities, [post.post_id]: post };
      }, {});

      return {
        ...state,
        entities: { ...state.entities, ...postEntities },
        byTopic: {
          ...state.byTopic,
          [topicId]: {
            ids: state.byTopic[topicId] !== undefined ? [...postIds, ...state.byTopic[topicId].ids] : postIds,
            isMoreAvailable: posts.length === POSTS_PER_LOAD
          }
        }
      };
    }

    default: {
      return state;
    }
  }
}

export const getEntities = (state: State) => state.entities;

export const getByTopic = (state: State) => state.byTopic;
