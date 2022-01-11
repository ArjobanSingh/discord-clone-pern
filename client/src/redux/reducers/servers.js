import * as C from '../../constants/servers';
import { APP_URL } from '../../utils/axiosConfig';

export default (state = {}, action) => {
  switch (action.type) {
    case C.SAVE_ALL_SERVERS_LIST:
      return action.payload.servers.reduce((acc, server) => {
        const { serverName, serverId, ...rest } = server;
        acc[server.serverId] = {
          ...rest,
          name: serverName,
          id: serverId,
          isFetchingData: false,
          error: null,
          inviteUrls: {},
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
          inviteUrls: {},
        },
      };
    case C.REMOVE_SERVER: {
      const newState = { ...state };
      delete newState[action.payload.serverId];
      return newState;
    }
    case C.SERVER_DETAILS_REQUESTED: {
      const newState = { ...state };
      newState[action.payload.serverId] = {
        ...newState[action.payload.serverId],
        isFetchingData: true,
        error: null,
      };
      return newState;
    }
    case C.SERVER_DETAILS_FAILED: {
      const newState = { ...state };
      newState[action.payload.serverId] = {
        ...newState[action.payload.serverId],
        isFetchingData: false,
        error: action.payload.error,
      };
      return newState;
    }
    case C.SERVER_DETAILS_SUCCESS: {
      const newState = { ...state };
      newState[action.payload.data.id] = {
        ...action.payload.data,
        inviteUrls: { ...newState[action.payload.data.id].inviteUrls },
        isFetchingData: false,
        error: null,
      };
      return newState;
    }
    case C.SAVE_INVITE_URL: {
      const newState = { ...state };
      const {
        serverId, minutes, inviteUrl, expireAt,
      } = action.payload;
      newState[serverId] = {
        ...newState[serverId],
        inviteUrls: {
          ...newState[serverId].inviteUrls,
          [minutes]: {
            inviteUrl: `${APP_URL}/${inviteUrl}`,
            expireAt,
          },
        },
      };
      return newState;
    }
    default:
      return state;
  }
};
