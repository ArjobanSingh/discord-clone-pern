import {
  take, call, fork, select, put,
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { toast } from 'react-toastify';
import socketHandler from '../services/socket-client';
import * as C from '../constants/socket-io';
import { sendChannelMessageSent } from '../redux/actions/channels';
import { kickServerMemberSuccess, leaveServerMemberSuccess, updateOwnershipSuccess } from '../redux/actions/servers';
import { setNavigateState } from '../redux/actions/navigate';
import { getServerDetails } from '../redux/reducers';

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
  const { user: loggedInUser } = yield select((state) => state.user);
  const { event, args } = socketEvent;
  const [payload] = args;

  console.log('socket', event, payload);
  switch (event) {
    case C.NEW_CHANNEL_MESSAGE: {
      const { serverId, channelId } = payload;
      yield put(sendChannelMessageSent(serverId, channelId, undefined, payload));
      break;
    }
    case C.SERVER_OWNER_TRANSFERRED: {
      const { serverId } = payload;
      yield put(updateOwnershipSuccess(serverId, payload));
      break;
    }
    case C.SERVER_USER_KICKED_OUT: {
      const { serverId, userId } = payload;
      const isLoggedInUser = userId === loggedInUser.id;
      const isSameServerOpened = window.location.pathname.includes(`/channels/${serverId}`);

      if (isLoggedInUser) {
        const { name } = yield select((state) => getServerDetails(state, serverId));
        toast.info(`You have been kicked out from ${name} server`);

        if (isSameServerOpened) {
          // if current user kicked out from server, and current opened
          // server is the same one, navigate user to index route
          yield put(setNavigateState(['/', { replace: true }]));
        }
      }
      yield put(kickServerMemberSuccess(serverId, userId, isLoggedInUser));
      break;
    }
    case C.SERVER_MEMBER_LEFT: {
      const { serverId, userId } = payload;
      const isLoggedInUser = userId === loggedInUser.id;
      const isSameServerOpened = window.location.pathname.includes(`/channels/${serverId}`);
      if (isLoggedInUser && isSameServerOpened) {
        yield put(setNavigateState(['/', { replace: true }]));
      }
      yield put(leaveServerMemberSuccess(serverId, userId, isLoggedInUser));
      break;
    }
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
