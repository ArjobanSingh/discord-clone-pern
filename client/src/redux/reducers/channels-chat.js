import * as C from '../../constants/channels';
import * as S from '../../constants/servers';
import { MessageStatus } from '../../constants/Message';
import { isEmpty } from '../../utils/validators';

/*
  State schema: {
    [serverId1]: {
      [channelId1]: { ...channel1ChatState },
      [channelId2]: { ...channel2ChatState },
    },
    [serverId2]: {
      // same schema as server1
    },
  }
*/

const channelsChat = (state = {}, action) => {
  switch (action.type) {
    case C.CHANNEL_MESSAGES_REQUESTED: {
      const { channelId, serverId } = action.payload;
      const channelData = state[serverId]?.[channelId];
      if (isEmpty(channelData?.data)) {
        return {
          ...state,
          [serverId]: {
            ...(state[serverId] || {}),
            [channelId]: {
              isLoading: true,
              error: null,
              data: [],
              hasMore: true,
            },
          },
        };
      }
      return state;
    }
    case C.CHANNEL_MESSAGES_FAILED: {
      const { channelId, serverId } = action.payload;
      return {
        ...state,
        [serverId]: {
          ...state[serverId],
          [channelId]: {
            isLoading: false,
            error: action.payload.error,
            data: [],
            hasMore: true,
          },
        },
      };
    }
    case C.CHANNEL_MESSAGES_SUCCESS: {
      const { channelId, serverId, data } = action.payload;
      return {
        ...state,
        [serverId]: {
          ...state[serverId],
          [channelId]: {
            isLoading: false,
            error: null,
            data: action.payload.data,
            // if we got less messages than 50, means no more messages
            hasMore: !(data.length < 50),
          },
        },
      };
    }
    case C.RETRY_CHANNEL_FAILED_MESSAGE: {
      const { serverId, channelId, messageData } = action.payload;
      return {
        ...state,
        [serverId]: {
          ...state[serverId],
          [channelId]: {
            ...state[serverId][channelId],
            data: state[serverId][channelId].data.map((msg) => {
              if (msg.id === messageData.id) {
                // this is failed message which we are retrying
                return { ...msg, status: MessageStatus.SENDING };
              }
              return msg;
            }),
          },
        },
      };
    }
    case C.SEND_CHANNEL_MESSAGE_REQUESTED: {
      const { serverId, channelId, messageData } = action.payload;
      return {
        ...state,
        [serverId]: {
          ...state[serverId],
          [channelId]: {
            ...state[serverId][channelId],
            data: [...state[serverId][channelId].data, messageData],
          },
        },
      };
    }
    case C.SEND_CHANNEL_MESSAGE_SUCCESS: {
      const {
        serverId, channelId, messageData, localMessageKey,
      } = action.payload;
      const currentChannelData = state[serverId][channelId].data;
      const data = localMessageKey
        ? currentChannelData.map((message) => (message.id === localMessageKey ? messageData : message))
        : [...currentChannelData, messageData];

      return {
        ...state,
        [serverId]: {
          ...state[serverId],
          [channelId]: {
            ...state[serverId][channelId],
            data,
          },
        },
      };
    }
    case C.SEND_CHANNEL_MESSAGE_FAILED: {
      const {
        serverId, channelId, error, localMessageKey,
      } = action.payload;

      const data = state[serverId][channelId].data.map((message) => {
        if (message.id === localMessageKey) {
          return { ...message, status: MessageStatus.FAILED, errorMessage: error.message };
        }
        return message;
      });
      return {
        ...state,
        [serverId]: {
          ...state[serverId],
          [channelId]: {
            ...state[serverId][channelId],
            data,
          },
        },
      };
    }
    case C.DELETE_CHANNEL_MESSAGE_REQUESTED: {
      // TODO: with backend delete api, this action hanlder might change
      const { serverId, channelId, messageId } = action.payload;
      return {
        ...state,
        [serverId]: {
          ...state[serverId],
          [channelId]: {
            ...state[serverId][channelId],
            data: state[serverId][channelId].data.filter((msg) => msg.id !== messageId),
          },
        },
      };
    }
    case C.CHANNEL_MORE_MESSAGES_REQUESTED: {
      const { serverId, channelId } = action.payload;
      return {
        ...state,
        [serverId]: {
          ...state[serverId],
          [channelId]: {
            ...state[serverId][channelId],
            isLoadingMore: true,
            moreError: null,
          },
        },
      };
    }
    case C.CHANNEL_MORE_MESSAGES_SUCCESS: {
      const { serverId, channelId, data } = action.payload;
      return {
        ...state,
        [serverId]: {
          ...state[serverId],
          [channelId]: {
            ...state[serverId][channelId],
            isLoadingMore: false,
            data: [...data, ...state[serverId][channelId].data],
            // if we got less messages than 50, means no more messages
            hasMore: !(data.length < 50),
          },
        },
      };
    }
    case C.CHANNEL_MORE_MESSAGES_FAILED: {
      const { serverId, channelId, error } = action.payload;
      return {
        ...state,
        [serverId]: {
          ...state[serverId],
          [channelId]: {
            ...state[serverId][channelId],
            isLoadingMore: false,
            moreError: error,
          },
        },
      };
    }
    case C.REMOVE_CHANNEL_MESSAGE_OBJECT_URL: {
      const { serverId, channelId, messageId } = action.payload;
      return {
        ...state,
        [serverId]: {
          ...state[serverId],
          [channelId]: {
            ...state[serverId][channelId],
            data: state[serverId][channelId].data.map((message) => {
              if (message.id === messageId) {
                return { ...message, blobUrl: undefined };
              }
              return message;
            }),
          },
        },
      };
    }
    case S.KICK_SERVER_MEMBER_SUCCESS: {
      const { serverId, isLoggedInUser } = action.payload;
      if (isLoggedInUser) {
        // if current logged in user got kicked out from some server
        // delete chat details for that server
        const newState = { ...state };
        delete newState[serverId];
        return newState;
      }
      return state;
    }
    case S.RESET_EXPLORE_SERVER: {
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

export default channelsChat;

export const getChannelMessagesData = (state, serverId, channelId) => state[serverId]?.[channelId];
