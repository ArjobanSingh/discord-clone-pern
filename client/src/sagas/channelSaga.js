import { all, call, takeEvery } from 'redux-saga/effects';
import { SEND_CHANNEL_MESSAGE_REQUESTED } from '../constants/channels';
import { SEND_CHANNEL_MESSAGE } from '../constants/socket-io';
import socketHandler from '../services/socket-client';

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
    const response = yield call(sendMessageAsync, actionData.payload);
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
