import * as C from '../../constants/channels';
import { MessageStatus } from '../../constants/Message';
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
            data: [],
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
          data: [],
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
    case C.RETRY_CHANNEL_FAILED_MESSAGE: {
      const { channelId, messageData } = action.payload;
      return {
        ...state,
        [channelId]: {
          ...state[channelId],
          data: state[channelId].data.map((msg) => {
            if (msg.id === messageData.id) {
              // this is failed message which we are retrying
              return { ...msg, status: MessageStatus.SENDING };
            }
            return msg;
          }),
        },
      };
    }
    case C.SEND_CHANNEL_MESSAGE_REQUESTED: {
      const { channelId, messageData } = action.payload;
      return {
        ...state,
        [channelId]: {
          ...state[channelId],
          data: [...state[channelId].data, messageData],
        },
      };
    }
    case C.SEND_CHANNEL_MESSAGE_SUCCESS: {
      const { channelId, messageData, tempMessageId } = action.payload;
      const currentChannelData = state[channelId].data;
      const data = tempMessageId
        ? currentChannelData.map((message) => (message.id === tempMessageId ? messageData : message))
        : [...currentChannelData, messageData];

      return {
        ...state,
        [channelId]: {
          ...state[channelId],
          data,
        },
      };
    }
    case C.SEND_CHANNEL_MESSAGE_FAILED: {
      const { channelId, error, tempMessageId } = action.payload;
      const data = state[channelId].data.map((message) => {
        if (message.id === tempMessageId) {
          return { ...message, status: MessageStatus.FAILED, errorMessage: error.message };
        }
        return message;
      });
      return {
        ...state,
        [channelId]: {
          ...state[channelId],
          data,
        },
      };
    }
    case C.DELETE_CHANNEL_MESSAGE_REQUESTED: {
      // TODO: with backend delete api, this action hanlder might change
      const { channelId, messageId } = action.payload;
      return {
        ...state,
        [channelId]: {
          ...state[channelId],
          data: state[channelId].data.filter((msg) => msg.id !== messageId),
        },
      };
    }
    case C.CHANNEL_MORE_MESSAGES_REQUESTED: {
      const { channelId } = action.payload;
      return {
        ...state,
        [channelId]: {
          ...state[channelId],
          isLoadingMore: true,
          moreError: null,
        },
      };
    }
    case C.CHANNEL_MORE_MESSAGES_SUCCESS: {
      const { channelId, data } = action.payload;
      return {
        ...state,
        [channelId]: {
          ...state[channelId],
          isLoadingMore: false,
          data: [...data, ...state[channelId].data],
          // if we got less messages than 50, means no more messages
          hasMore: !(data.length < 50),
        },
      };
    }
    case C.CHANNEL_MORE_MESSAGES_FAILED: {
      const { channelId, error } = action.payload;
      return {
        ...state,
        [channelId]: {
          ...state[channelId],
          isLoadingMore: false,
          moreError: error,
        },
      };
    }
    case C.REMOVE_CHANNEL_MESSAGE_OBJECT_URL: {
      const { channelId, messageId } = action.payload;
      return {
        ...state,
        [channelId]: {
          ...state[channelId],
          data: state[channelId].data.map((message) => {
            if (message.id === messageId) {
              return { ...message, blobUrl: undefined };
            }
            return message;
          }),
        },
      };
    }
    default:
      return state;
  }
};

export default channelsChat;

export const getChannelMessagesData = (state, channelId) => state[channelId];
