import * as C from '../../constants/channels';

export const saveAllChannels = (serverId, channels) => ({
  type: C.SAVE_ALL_CHANNELS_LIST,
  payload: {
    serverId,
    channels,
  },
});

export const addChannel = (serverId, channel) => ({
  type: C.ADD_CHANNEL_SUCCESS,
  payload: {
    serverId,
    channel,
  },
});

export const sendChannelMessageRequested = (serverId, channelId, messageData) => ({
  type: C.SEND_CHANNEL_MESSAGE_REQUESTED,
  payload: {
    serverId,
    channelId,
    messageData,
  },
});

export const sendChannelMessageFailed = (serverId, channelId, error) => ({
  type: C.SEND_CHANNEL_MESSAGE_FAILED,
  payload: {
    serverId,
    channelId,
    error,
  },
});

export const sendChannelMessageSent = (serverId, channelId, messageData) => ({
  type: C.SEND_CHANNEL_MESSAGE_SUCCESS,
  payload: {
    serverId,
    channelId,
    messageData,
  },
});
