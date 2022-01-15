import * as C from './servers';

export default (state = {}, action) => {
  switch (action.type) {
    case C.JOIN_SERVER_REQUESTED:
      return {
        ...state,
        [action.payload.serverId]: {
          isLoading: true, error: null,
        },
      };
    case C.JOIN_SERVER_FAILED:
      return {
        ...state,
        [action.payload.serverId]: {
          isLoading: false, error: action.payload.error,
        },
      };
    case C.JOIN_SERVER_SUCCESS: {
      const newState = { ...state };
      delete newState[action.payload.serverId];
      return newState;
    }
    default:
      return state;
  }
};

export const getJoinServerApi = (state, serverId) => state[serverId];
