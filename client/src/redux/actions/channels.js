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
