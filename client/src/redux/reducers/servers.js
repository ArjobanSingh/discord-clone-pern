import { combineReducers } from 'redux';
import * as C from '../../constants/servers';
import { APP_URL } from '../../utils/axiosConfig';

const allServers = (state = {}, action) => {
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
    case C.JOIN_SERVER_SUCCESS:
    case C.CREATE_SERVER_SUCCESS:
      return {
        [action.payload.serverId]: {
          ...action.payload.data,
          isFetchingData: false,
          error: null,
          inviteUrls: {},
        },
        ...state,
      };
    case C.REMOVE_SERVER: {
      const newState = { ...state };
      delete newState[action.payload.serverId];
      return newState;
    }
    case C.SERVER_DETAILS_REQUESTED: {
      if (action.payload.isExploringServer) return state;
      const newState = { ...state };
      newState[action.payload.serverId] = {
        ...newState[action.payload.serverId],
        isFetchingData: true,
        error: null,
      };
      return newState;
    }
    case C.SERVER_DETAILS_FAILED: {
      if (action.payload.isExploringServer) return state;
      const newState = { ...state };
      newState[action.payload.serverId] = {
        ...newState[action.payload.serverId],
        isFetchingData: false,
        error: action.payload.error,
      };
      return newState;
    }
    case C.SERVER_DETAILS_SUCCESS: {
      if (action.payload.isExploringServer) return state;
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
            inviteUrl: `${APP_URL}/invite/${inviteUrl}`,
            expireAt,
          },
        },
      };
      return newState;
    }
    case C.UPDATE_SERVER_SUCCESS: {
      const newState = { ...state };
      newState[action.payload.serverId] = {
        ...newState[action.payload.serverId],
        ...action.payload.data,
      };
      return newState;
    }
    case C.UPDATE_SERVER_ROLE_SUCCESS: {
      const newState = { ...state };
      const thisServer = newState[action.payload.serverId];
      newState[action.payload.serverId] = {
        ...thisServer,
        members: thisServer.members.map((member) => {
          if (member.userId === action.payload.data.userId) {
            return {
              ...member,
              role: action.payload.data.role,
            };
          }
          return member;
        }),
      };
      return newState;
    }
    default:
      return state;
  }
};

const updateServers = (state = {}, action) => {
  switch (action.type) {
    case C.UPDATE_SERVER_REQUESTED:
      return {
        ...state,
        [action.payload.serverId]: {
          isLoading: true,
          error: null,
        },
      };
    case C.UPDATE_SERVER_SUCCESS: {
      const newState = { ...state };
      delete newState[action.payload.serverId];
      return newState;
    }
    case C.UPDATE_SERVER_FAILED:
      return {
        ...state,
        [action.payload.serverId]: {
          isLoading: false,
          error: action.payload.error,
        },
      };
    default:
      return state;
  }
};

export default combineReducers({
  allServers,
  updateServers,
});

export const getAllServers = (state) => state.allServers;
export const getServerDetails = (state, serverId) => state.allServers[serverId];

export const getUpdateServerData = (state, serverId) => state.updateServers[serverId];
