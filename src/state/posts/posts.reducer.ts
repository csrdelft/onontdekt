import * as posts from './posts.actions';
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

export function reducer(state = initialState, action: posts.Actions): State {
  switch (action.type) {
    case posts.ActionTypes.LOAD_COMPLETE: {
      const payload = action.payload;
      const topicId = payload.topicId;
      const postIds = payload.posts.map(post => post.post_id);
      const postEntities = payload.posts.reduce((entities: { [id: number]: ForumPost }, post) => {
        return { ...entities, [post.post_id]: post };
      }, {});

      return {
        ...state,
        entities: payload.reset ? postEntities : { ...state.entities, ...postEntities },
        byTopic: {
          ...state.byTopic,
          [topicId]: {
            ids: (state.byTopic[topicId] !== undefined && !payload.reset) ? [...postIds, ...state.byTopic[topicId].ids] : postIds,
            isMoreAvailable: payload.posts.length === POSTS_PER_LOAD
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
