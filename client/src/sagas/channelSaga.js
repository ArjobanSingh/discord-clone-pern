import {
  all, call, put, select, takeEvery,
} from 'redux-saga/effects';
import { toast } from 'react-toastify';
import {
  CHANNEL_MESSAGES_REQUESTED,
  CHANNEL_MORE_MESSAGES_REQUESTED,
  DELETE_CHANNEL_MESSAGE_REQUESTED,
  RETRY_CHANNEL_FAILED_MESSAGE,
  SEND_CHANNEL_MESSAGE_REQUESTED,
} from '../constants/channels';
import {
  channelMessagesFailed,
  channelMessagesSuccess,
  channelMoreMessagesFailed,
  channelMoreMessagesSuccess,
  sendChannelMessageFailed,
  sendChannelMessageSent,
} from '../redux/actions/channels';
import { getChannelMessagesData } from '../redux/reducers';
import socketHandler from '../services/socket-client';
import { ChannelApi } from '../utils/apiEndpoints';
import axiosInstance from '../utils/axiosConfig';
import { handleError } from '../utils/helperFunctions';
import { isEmpty } from '../utils/validators';

const socket = socketHandler.getSocket();

function* getChannelMessages(actionData) {
  const { channelId, serverId, testError } = actionData.payload;
  try {
    const previousChannelState = yield select((state) => getChannelMessagesData(state, serverId, channelId));
    // if messages already not present than only fetch again
    if (isEmpty(previousChannelState?.data)) {
      const url = `${ChannelApi.GET_CHANNEL_MESSAGES}/${serverId}/${testError ? undefined : channelId}`;
      const response = yield call(axiosInstance.get, url);
      yield put(channelMessagesSuccess(serverId, channelId, response.data.messages.reverse()));
    }
  } catch (err) {
    yield put(handleError(err, (error) => (
      channelMessagesFailed(serverId, channelId, error.message)
    )));
  }
}

// TODO: maybe handle messages in chunk for fast rendering
function* getMoreChannelMessages(actionData) {
  const { channelId, serverId } = actionData.payload;
  try {
    const oldestMessage = yield select((state) => getChannelMessagesData(state, serverId, channelId).data[0]);
    const { createdAt } = oldestMessage;
    const url = `${ChannelApi.GET_CHANNEL_MESSAGES}/${serverId}/${channelId}?cursor=${createdAt}`;
    const response = yield call(axiosInstance.get, url);
    // yield call(() => new Promise((r) => setTimeout(r, 3000)));
    yield put(channelMoreMessagesSuccess(serverId, channelId, response.data.messages.reverse()));
  } catch (err) {
    yield put(handleError(err, (error) => {
      toast.error(error.message);
      return channelMoreMessagesFailed(serverId, channelId, error);
    }));
  }
}

function* sendChannelMessage(actionData) {
  const { serverId, channelId, messageData } = actionData.payload;
  const { file, ...restMessageData } = messageData;

  const jsonBody = {
    ...actionData.payload,
    messageData: restMessageData,
    sid: socket.id,
  };

  try {
    const formData = new FormData();
    formData.append('jsonData', JSON.stringify(jsonBody));

    if (file) formData.append('file', file);
    const url = ChannelApi.SEND_CHANNEL_MESSAGE;
    const response = yield call(axiosInstance.post, url, formData);
    const newMessageData = { ...response.data };

    const { blobUrl, localKey } = restMessageData;
    newMessageData.localKey = localKey;
    if (blobUrl) {
      newMessageData.blobUrl = blobUrl;
    }

    yield put(sendChannelMessageSent(serverId, channelId, localKey, newMessageData));
  } catch (err) {
    console.log('Message sending error: ', err, err.message);
    yield put(handleError(err, (error) => (
      sendChannelMessageFailed(serverId, channelId, restMessageData.localKey, error)
    )));
  }
}

function* channelSaga() {
  yield all([
    takeEvery(SEND_CHANNEL_MESSAGE_REQUESTED, sendChannelMessage),
    takeEvery(RETRY_CHANNEL_FAILED_MESSAGE, sendChannelMessage),
    takeEvery(CHANNEL_MESSAGES_REQUESTED, getChannelMessages),
    takeEvery(CHANNEL_MORE_MESSAGES_REQUESTED, getMoreChannelMessages),
    // takeEvery(DELETE_CHANNEL_MESSAGE_REQUESTED, todoSaga),
  ]);
}

export default channelSaga;
