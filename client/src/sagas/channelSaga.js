import {
  all, call, put, select, takeEvery,
} from 'redux-saga/effects';
import { toast } from 'react-toastify';
import {
  CHANNEL_MESSAGES_REQUESTED,
  CHANNEL_MORE_MESSAGES_REQUESTED,
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
  const { channelId, serverId } = actionData.payload;
  try {
    const previousChannelState = yield select((state) => getChannelMessagesData(state, channelId));
    // if messages already not present than only fetch again
    if (isEmpty(previousChannelState?.data)) {
      const url = `${ChannelApi.GET_CHANNEL_MESSAGES}/${serverId}/${channelId}`;
      const response = yield call(axiosInstance.get, url);
      yield put(channelMessagesSuccess(channelId, response.data.messages.reverse()));
    }
  } catch (err) {
    yield put(handleError(err, (error) => (
      channelMessagesFailed(channelId, error)
    )));
  }
}

// TODO: maybe handle messages in chunk for fast rendering
function* getMoreChannelMessages(actionData) {
  const { channelId, serverId } = actionData.payload;
  try {
    const oldestMessage = yield select((state) => getChannelMessagesData(state, channelId).data[0]);
    const { createdAt } = oldestMessage;
    const url = `${ChannelApi.GET_CHANNEL_MESSAGES}/${serverId}/${channelId}?cursor=${createdAt}`;
    const response = yield call(axiosInstance.get, url);
    // yield call(() => new Promise((r) => setTimeout(r, 3000)));
    yield put(channelMoreMessagesSuccess(channelId, response.data.messages.reverse()));
  } catch (err) {
    yield put(handleError(err, (error) => {
      toast.error(error.message);
      return channelMoreMessagesFailed(channelId, error);
    }));
  }
}

function* sendChannelMessage(actionData) {
  const { serverId, channelId, messageData } = actionData.payload;
  try {
    const url = ChannelApi.SEND_CHANNEL_MESSAGE;
    const response = yield call(axiosInstance.post, url, { ...actionData.payload, sid: socket.id });
    yield put(sendChannelMessageSent(serverId, channelId, messageData.id, response.data));
  } catch (err) {
    console.log('Message sending error: ', err, err.message);
    // TODO: handle error
    yield put(handleError(err, (error) => (
      sendChannelMessageFailed(serverId, channelId, messageData.id, error)
    )));
  }
}

function* channelSaga() {
  yield all([
    takeEvery(SEND_CHANNEL_MESSAGE_REQUESTED, sendChannelMessage),
    takeEvery(CHANNEL_MESSAGES_REQUESTED, getChannelMessages),
    takeEvery(CHANNEL_MORE_MESSAGES_REQUESTED, getMoreChannelMessages),
  ]);
}

export default channelSaga;
