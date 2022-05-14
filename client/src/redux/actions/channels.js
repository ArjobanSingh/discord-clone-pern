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

export const sendChannelMessageFailed = (serverId, channelId, localMessageKey, error) => ({
  type: C.SEND_CHANNEL_MESSAGE_FAILED,
  payload: {
    serverId,
    channelId,
    localMessageKey,
    error,
  },
});

export const sendChannelMessageSent = (serverId, channelId, localMessageKey, messageData) => ({
  type: C.SEND_CHANNEL_MESSAGE_SUCCESS,
  payload: {
    serverId,
    channelId,
    localMessageKey,
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

export const channelMessagesSuccess = (serverId, channelId, data) => ({
  type: C.CHANNEL_MESSAGES_SUCCESS,
  payload: {
    serverId,
    channelId,
    data,
  },
});

export const channelMessagesFailed = (serverId, channelId, error) => ({
  type: C.CHANNEL_MESSAGES_FAILED,
  payload: {
    serverId,
    channelId,
    error,
  },
});

export const channelMoreMessagesRequested = (serverId, channelId) => ({
  type: C.CHANNEL_MORE_MESSAGES_REQUESTED,
  payload: {
    serverId,
    channelId,
  },
});

export const channelMoreMessagesSuccess = (serverId, channelId, data) => ({
  type: C.CHANNEL_MORE_MESSAGES_SUCCESS,
  payload: {
    serverId,
    channelId,
    data,
  },
});

export const channelMoreMessagesFailed = (serverId, channelId, error) => ({
  type: C.CHANNEL_MORE_MESSAGES_FAILED,
  payload: {
    serverId,
    channelId,
    error,
  },
});

export const removeChannelMessageObjectUrl = (serverId, channelId, messageId) => ({
  type: C.REMOVE_CHANNEL_MESSAGE_OBJECT_URL,
  payload: {
    serverId,
    channelId,
    messageId,
  },
});

export const retryFailedChannelMessage = (serverId, channelId, messageData) => ({
  type: C.RETRY_CHANNEL_FAILED_MESSAGE,
  payload: {
    serverId,
    channelId,
    messageData,
  },
});

export const deleteChannelMessage = (serverId, channelId, messageId) => ({
  type: C.DELETE_CHANNEL_MESSAGE_REQUESTED,
  payload: {
    serverId,
    channelId,
    messageId,
  },
});
