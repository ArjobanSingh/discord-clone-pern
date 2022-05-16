import * as C from '../../constants/channels';
import * as S from '../../constants/servers';

/*
  State schema: {
    [serverId1]: {
      [channelId1]: { ...channel1 },
      [channelId2]: { ...channel2 },
    },
    [serverId2]: {
      // same schema as server1
    },
  }
*/

export default (state = {}, action) => {
  switch (action.type) {
    case C.SAVE_ALL_CHANNELS_LIST:
      return {
        ...state,
        [action.payload.serverId]: action.payload.channels.reduce((acc, channel) => {
          acc[channel.id] = channel;
          return acc;
        }, {}),
      };
    case C.ADD_CHANNEL_SUCCESS: {
      const { serverId, channel } = action.payload;
      if (state[serverId][channel.id]) return state;

      return {
        ...state,
        [serverId]: {
          ...state[serverId],
          [channel.id]: channel,
        },
      };
    }
    case S.KICK_SERVER_MEMBER_SUCCESS:
    case S.LEAVE_SERVER_MEMBER_SUCCESS: {
      const { serverId, isLoggedInUser } = action.payload;
      if (isLoggedInUser) {
        const newState = { ...state };
        delete newState[serverId];
        return newState;
      }
      return state;
    }
    case S.RESET_EXPLORE_SERVER:
    case S.DELETE_SERVER_SUCCESS: {
      const { serverId } = action.payload;
      if (!state[serverId]) return state;
      const newState = { ...state };
      delete newState[serverId];
      return newState;
    }
    default:
      return state;
  }
};

export const getAllServerChannels = (state, serverId) => state[serverId];
export const getChannelData = (state, serverId, channelId) => state[serverId][channelId];
