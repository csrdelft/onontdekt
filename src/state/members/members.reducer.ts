import { createSelector } from 'reselect';

import * as members from './members.actions';
import { Member, MemberDetail } from './members.model';

export interface State {
  ids: string[];
  entities: { [id: string]: Member };
  detailIds: string[];
  detailEntities: { [id: string]: MemberDetail };
  query: string | null;
  selectedMemberId: string | null;
}

export const initialState: State = {
  ids: [],
  entities: {},
  detailIds: [],
  detailEntities: {},
  query: null,
  selectedMemberId: null,
};

export function reducer(state = initialState, action: members.Actions): State {
  switch (action.type) {
    case members.ActionTypes.LOAD_ALL_COMPLETE: {
      const loadedMembers = action.payload;
      const memberIds = loadedMembers.map(member => member.id);
      const memberEntities = loadedMembers.reduce((entities: { [id: string]: Member }, member: Member) => {
        return { ...entities, [member.id]: member };
      }, {});

      return {
        ...state,
        ids: memberIds,
        entities: memberEntities
      };
    }

    case members.ActionTypes.LOAD: {
      const member = action.payload;

      if (state.detailIds.indexOf(member.id) > -1) {
        return state;
      }

      return {
        ...state,
        detailIds: [...state.detailIds, member.id],
        detailEntities: {
          ...state.detailEntities,
          [member.id]: member
        }
      };
    }

    case members.ActionTypes.SELECT: {
      return {
        ...state,
        selectedMemberId: action.payload
      };
    }

    case members.ActionTypes.SEARCH: {
      return {
        ...state,
        query: action.payload
      };
    }

    default: {
      return state;
    }
  }
}

export const getEntities = (state: State) => state.entities;

export const getIds = (state: State) => state.ids;

export const getDetailEntities = (state: State) => state.detailEntities;

export const getQuery = (state: State) => state.query;

export const getSelectedId = (state: State) => state.selectedMemberId;

export const getSelected = createSelector(getEntities, getSelectedId, (entities, selectedId) => {
  return (selectedId && entities[selectedId]) || null;
});

export const getSelectedDetail = createSelector(getDetailEntities, getSelectedId, (detailEntities, selectedId) => {
  return (selectedId && detailEntities[selectedId]) || null;
});

export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});

export const getQueryResults = createSelector(getAll, getQuery, (allMembers, query) => {
  if (!query) {
    return allMembers;
  }

  const queryText = query.toLowerCase().replace(/,|\.|-/g, ' ');
  if (queryText.length === 0) {
    return allMembers;
  }

  return allMembers.filter(member => {
    const mid = member.tussenvoegsel ? member.tussenvoegsel + ' ' : '';
    const search = `${member.id} ${member.voornaam} ${mid}${member.achternaam}`.toLowerCase();

    return search.indexOf(queryText) !== -1;
  });
});
