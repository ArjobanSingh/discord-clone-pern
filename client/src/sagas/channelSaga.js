import { all, call, takeEvery } from 'redux-saga/effects';
import { SEND_CHANNEL_MESSAGE_REQUESTED } from '../constants/channels';
import { SEND_CHANNEL_MESSAGE } from '../constants/socket-io';
import socketHandler from '../services/socket-client';
import { ChannelApi } from '../utils/apiEndpoints';
import axiosInstance from '../utils/axiosConfig';

const socket = socketHandler.getSocket();

const sendMessageAsync = (content) => new Promise((resolve, reject) => {
  socketHandler.emitEvent(SEND_CHANNEL_MESSAGE, content, (error, response) => {
    if (error) {
      reject(error);
      return;
    }
    resolve(response);
  });
});

function* sendChannelMessage(actionData) {
//   const { serverId, channelId, messageData } = actionData;
  try {
    const url = ChannelApi.SEND_CHANNEL_MESSAGE;
    const response = yield call(axiosInstance.post, url, { ...actionData.payload, sid: socket.id });
    console.log('Chat message response: ', response);
  } catch (err) {
    console.log('Message sending error: ', err, err.message);
  }
}

function* channelSaga() {
  yield all([
    takeEvery(SEND_CHANNEL_MESSAGE_REQUESTED, sendChannelMessage),
  ]);
}

export default channelSaga;
