import { combineReducers } from 'redux';
import * as C from '../../constants/notifications';

/*
  State Structure: {
    serverId1: {
      channelId1: {
        count: number,
      },
    },
    serverId2: {},
  }
*/
const serverNotifications = (state = {}, action) => {
  switch (action.type) {
    case C.INCREMENT_CHANNEL_NOTIFICATIONS: {
      const { serverId, channelId } = action.payload;
      return {
        ...state,
        [serverId]: {
          ...(state[serverId] || {}),
          [channelId]: {
            count: (state[serverId]?.[channelId]?.count ?? 0) + 1,
          },
        },
      };
    }
    case C.REMOVE_CHANNEL_NOTIFICATIONS: {
      const { serverId, channelId } = action.payload;
      if (!state[serverId]?.[channelId]) return state;

      const newState = { ...state };
      newState[serverId] = { ...newState[serverId] };
      delete newState[serverId][channelId];
      return newState;
    }
    default:
      return state;
  }
};

export default combineReducers({
  server: serverNotifications,
  // would be easy to add other notification types in future if required
});

export const getServerNotificationsData = (state, serverId) => state.server[serverId];
export const getChannelNotifications = (state, serverId, channelId) => state.server[serverId]?.[channelId];
