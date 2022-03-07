import {
  take, call, fork, select,
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import socketHandler from '../services/socket-client';
import { NEW_CHANNEL_MESSAGE } from '../constants/socket-io';

function createSocketChannel(socket) {
  return eventChannel((emit) => {
    socket.onAny((event, ...args) => {
      emit({ event, args });
    });

    const unsubscribe = () => {
      console.log('closing event channel');
    };

    return unsubscribe;
  });
}

function* handleSocketEvents(socketEvent) {
  const { user } = yield select((state) => state.user);
  const { event, args } = socketEvent;
  const [payload] = args;

  switch (event) {
    case NEW_CHANNEL_MESSAGE:
      console.log('New message received: ', payload);
      break;
    default:
      break;
  }
}

function* socketSaga() {
  const socket = socketHandler.getSocket();
  const socketChannel = yield call(createSocketChannel, socket);

  while (true) {
    try {
      // An error from socketChannel will cause the saga jump to the catch block
      const socketEvent = yield take(socketChannel);
      yield fork(handleSocketEvents, socketEvent);
    } catch (err) {
      console.error('socket error in saga:', err);
      // socketChannel is still open in catch block
      // if we want end the socketChannel, we need close it explicitly
      // socketChannel.close()
    }
  }
}

export default socketSaga;
