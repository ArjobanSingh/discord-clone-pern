import { combineReducers } from 'redux';
import { ADD_CHANNEL_SUCCESS, DELETE_CHANNEL_SUCCESS } from '../../constants/channels';
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
    case C.UPDATE_SERVER_OWNERSHIP_SUCCESS: {
      const { data: { updatedMembers }, serverId } = action.payload;

      const { newOwner, oldOwner } = updatedMembers.reduce((acc, currentItem) => {
        if (currentItem.role === C.ServerMemberRoles.OWNER) acc.newOwner = currentItem;
        else acc.oldOwner = currentItem;
        return acc;
      }, {});

      return {
        ...state,
        [serverId]: {
          ...state[serverId],
          members: state[serverId].members.map((member) => {
            if (member.userId === newOwner.userId) {
              return { ...member, role: newOwner.role };
            }
            if (member.userId === oldOwner.userId) {
              return { ...member, role: oldOwner.role };
            }
            return member;
          }),
        },
      };
    }
    case C.KICK_SERVER_MEMBER_SUCCESS:
    case C.LEAVE_SERVER_MEMBER_SUCCESS: {
      const { serverId, userId, isLoggedInUser } = action.payload;
      if (isLoggedInUser) {
        // current logged in user got kicked out or left server
        const newState = { ...state };
        delete newState[serverId];
        return newState;
      }
      return {
        ...state,
        [serverId]: {
          ...state[serverId],
          members: state[serverId].members
            .filter((member) => member.userId !== userId),
        },
      };
    }
    case C.DELETE_SERVER_SUCCESS: {
      const { serverId } = action.payload;
      if (!state[serverId]) return state;

      const newState = { ...state };
      delete newState[serverId];
      return newState;
    }
    case ADD_CHANNEL_SUCCESS: {
      const { serverId, channel } = action.payload;
      if (!state[serverId]) return state;

      const newState = { ...state };
      const newChannels = [];

      let isChannelAlreadyPresent = false;
      newState[serverId].channels.forEach((currentChannel) => {
        if (currentChannel.id === channel.id) {
          isChannelAlreadyPresent = true;
        }
        newChannels.push(currentChannel);
      });

      if (!isChannelAlreadyPresent) newChannels.push(channel);

      newState[serverId] = {
        ...newState[serverId],
        channels: newChannels,
      };
      return newState;
    }
    case DELETE_CHANNEL_SUCCESS: {
      const { serverId, channelId } = action.payload;
      if (!state[serverId]) return state;

      const newState = { ...state };
      newState[serverId] = {
        ...newState[serverId],
        channels: newState[serverId].channels.filter((channel) => channel.id !== channelId),
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
    case C.UPDATE_SERVER_OWNERSHIP_REQUESTED:
    case C.KICK_SERVER_MEMBER_REQUESTED:
      return {
        ...state,
        [action.payload.serverId]: {
          isLoading: true,
          error: null,
        },
      };
    case C.UPDATE_SERVER_SUCCESS:
    case C.UPDATE_SERVER_OWNERSHIP_SUCCESS:
    case C.KICK_SERVER_MEMBER_SUCCESS: {
      const newState = { ...state };
      delete newState[action.payload.serverId];
      return newState;
    }
    case C.UPDATE_SERVER_FAILED:
    case C.UPDATE_SERVER_OWNERSHIP_FAILED:
    case C.KICK_SERVER_MEMBER_FAILED:
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
