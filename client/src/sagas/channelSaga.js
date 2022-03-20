import {
  all, call, put, select, takeEvery,
} from 'redux-saga/effects';
import { CHANNEL_MESSAGES_REQUESTED, SEND_CHANNEL_MESSAGE_REQUESTED } from '../constants/channels';
import {
  channelMessagesFailed, channelMessagesSuccess, sendChannelMessageFailed, sendChannelMessageSent,
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
      console.log('Get channel messages response: ', response);
      yield put(channelMessagesSuccess(channelId, response.data.messages.reverse()));
    }
  } catch (err) {
    yield put(handleError(err, (error) => (
      channelMessagesFailed(channelId, error)
    )));
  }
}

function* sendChannelMessage(actionData) {
  const { serverId, channelId, messageData } = actionData.payload;
  try {
    const url = ChannelApi.SEND_CHANNEL_MESSAGE;
    const response = yield call(axiosInstance.post, url, { ...actionData.payload, sid: socket.id });
    yield put(sendChannelMessageSent(serverId, channelId, messageData.id, response.data));
    console.log('Chat message response: ', response);
  } catch (err) {
    console.log('Message sending error: ', err, err.message);
    yield put(handleError(err, (error) => (
      sendChannelMessageFailed(serverId, channelId, messageData.id, error)
    )));
  }
}

function* channelSaga() {
  yield all([
    takeEvery(SEND_CHANNEL_MESSAGE_REQUESTED, sendChannelMessage),
    takeEvery(CHANNEL_MESSAGES_REQUESTED, getChannelMessages),
  ]);
}

export default channelSaga;
