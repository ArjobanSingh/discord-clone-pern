import * as C from '../../constants/servers';

export default (state = {}, action) => {
  switch (action.type) {
    case C.JOIN_SERVER_REQUESTED: {
      const { server, inviteId } = action.payload;
      return {
        ...state,
        [inviteId || server.id]: {
          isLoading: true, error: null,
        },
      };
    }
    case C.JOIN_SERVER_FAILED: {
      const { serverId, inviteId } = action.payload;
      return {
        ...state,
        [inviteId || serverId]: {
          isLoading: false, error: action.payload.error,
        },
      };
    }
    case C.JOIN_SERVER_SUCCESS: {
      const { serverId, inviteId } = action.payload;
      const newState = { ...state };
      delete newState[inviteId || serverId];
      return newState;
    }
    default:
      return state;
  }
};

export const getJoinServerApi = (state, serverId) => state[serverId];
