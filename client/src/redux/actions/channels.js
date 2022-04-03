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

export const sendChannelMessageFailed = (serverId, channelId, tempMessageId, error) => ({
  type: C.SEND_CHANNEL_MESSAGE_FAILED,
  payload: {
    serverId,
    channelId,
    tempMessageId,
    error,
  },
});

export const sendChannelMessageSent = (serverId, channelId, tempMessageId, messageData) => ({
  type: C.SEND_CHANNEL_MESSAGE_SUCCESS,
  payload: {
    serverId,
    channelId,
    tempMessageId,
    messageData,
  },
});

export const channelMessagesRequested = (serverId, channelId) => ({
  type: C.CHANNEL_MESSAGES_REQUESTED,
  payload: {
    channelId,
    serverId,
  },
});

export const channelMessagesSuccess = (channelId, data) => ({
  type: C.CHANNEL_MESSAGES_SUCCESS,
  payload: {
    channelId,
    data,
  },
});

export const channelMessagesFailed = (channelId, error) => ({
  type: C.CHANNEL_MESSAGES_FAILED,
  payload: {
    channelId,
    error,
  },
});

export const channelMoreMessagesRequested = (serverId, channelId) => ({
  type: C.CHANNEL_MORE_MESSAGES_REQUESTED,
  payload: {
    channelId,
    serverId,
  },
});

export const channelMoreMessagesSuccess = (channelId, data) => ({
  type: C.CHANNEL_MORE_MESSAGES_SUCCESS,
  payload: {
    channelId,
    data,
  },
});

export const channelMoreMessagesFailed = (channelId, error) => ({
  type: C.CHANNEL_MORE_MESSAGES_FAILED,
  payload: {
    channelId,
    error,
  },
});
