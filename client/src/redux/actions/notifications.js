import * as C from '../../constants/notifications';

export const appendChannelNotifications = (serverId, channelId) => ({
  type: C.INCREMENT_CHANNEL_NOTIFICATIONS,
  payload: {
    serverId,
    channelId,
  },
});

export const removeChannelNotifications = (serverId, channelId) => ({
  type: C.REMOVE_CHANNEL_NOTIFICATIONS,
  payload: {
    serverId,
    channelId,
  },
});
