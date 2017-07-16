import { createSelector } from 'reselect';

import * as topic from './topics.actions';
import { ForumTopic } from './topics.model';

export interface State {
  entities: { [id: number]: ForumTopic };
  ids: number[];
  selectedId: number | null;
  isMoreAvailable: boolean;
}

export const initialState: State = {
  ids: [],
  entities: {},
  selectedId: null,
  isMoreAvailable: true
};

export const TOPICS_PER_LOAD = 10;

export function reducer(state = initialState, action: topic.Actions): State {
  switch (action.type) {
    case topic.ActionTypes.LOAD_COMPLETE: {
      const reset = action.payload.reset;
      const topics = action.payload.topics;
      const topicIds = topics.map(t => t.draad_id);
      const topicEntities = topics.reduce((entities: { [id: string]: ForumTopic }, t: ForumTopic) => {
        return { ...entities, [t.draad_id]: t };
      }, {});

      return {
        ...state,
        ids: reset ? topicIds : [...state.ids, ...topicIds],
        entities: reset ? topicEntities : { ...state.entities, ...topicEntities },
        isMoreAvailable: topics.length === TOPICS_PER_LOAD
      };
    }

    case topic.ActionTypes.SELECT: {
      return {
        ...state,
        selectedId: action.payload
      };
    }

    case topic.ActionTypes.READ: {
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.payload]: {
            ...state.entities[action.payload],
            ongelezen: 0
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

export const getIds = (state: State) => state.ids;

export const getSelectedId = (state: State) => state.selectedId;

export const getSelected = createSelector(getEntities, getSelectedId, (entities, selectedId) => {
  return (selectedId && entities[selectedId]) || null;
});

export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});

export const getLength = createSelector(getIds, (ids) => {
  return ids.length;
});

export const isMoreAvailable = (state: State) => state.isMoreAvailable;
