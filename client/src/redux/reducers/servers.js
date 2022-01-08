import * as C from '../../constants/servers';

export default (state = {}, action) => {
  switch (action.type) {
    case C.SAVE_ALL_SERVERS_LIST:
      return action.payload.servers.reduce((acc, server) => {
        acc[server.serverId] = {
          ...server,
          isFetchingData: false,
          error: null,
          isServerDetailsFetched: false,
        };
        return acc;
      }, {});
    case C.ADD_SERVER:
      return {
        ...state,
        [action.payload.data.serverId]: {
          ...action.payload.data,
          isFetchingData: false,
          error: null,
          isServerDetailsFetched: false,
        },
      };
    case C.REMOVE_SERVER: {
      const newState = { ...state };
      delete newState[action.payload.serverId];
      return newState;
    }
    default:
      return state;
  }
};
