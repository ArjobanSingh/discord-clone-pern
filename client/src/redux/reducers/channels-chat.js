import * as C from '../../constants/channels';
import { isEmpty } from '../../utils/validators';

const channelsChat = (state = {}, action) => {
  switch (action.type) {
    case C.CHANNEL_MESSAGES_REQUESTED: {
      const channelData = state[action.payload.channelId];
      if (isEmpty(channelData?.data)) {
        return {
          ...state,
          [action.payload.channelId]: {
            isLoading: true,
            error: null,
            data: null,
            hasMore: true,
          },
        };
      }
      return state;
    }
    case C.CHANNEL_MESSAGES_FAILED:
      return {
        ...state,
        [action.payload.channelId]: {
          isLoading: false,
          error: action.payload.error,
          data: null,
          hasMore: true,
        },
      };
    case C.CHANNEL_MESSAGES_SUCCESS:
      return {
        ...state,
        [action.payload.channelId]: {
          isLoading: false,
          error: null,
          data: action.payload.data,
          // if we got less messages than 50, means no more messages
          hasMore: !(action.payload.data.length < 50),
        },
      };
    default:
      return state;
  }
};

export default channelsChat;

export const getChannelMessagesData = (state, channelId) => state[channelId];
