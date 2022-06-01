import {
  take, call, fork, select, put, all, takeEvery,
} from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { toast } from 'react-toastify';
import socketHandler from '../services/socket-client';
import * as C from '../constants/socket-io';
import {
  addChannelSuccess, deleteChannelSuccess, saveAllChannels, sendChannelMessageSent,
} from '../redux/actions/channels';
import {
  deleteServerSuccess,
  joinServerSucess,
  kickServerMemberSuccess,
  leaveServerMemberSuccess,
  newServerMemberJoined,
  updateOwnershipSuccess,
  updateServerRoleSuccess,
} from '../redux/actions/servers';
import { setNavigateState } from '../redux/actions/navigate';
import { getAllServers, getServerDetails } from '../redux/reducers';
import { INTERNET_RECONNECTED } from '../constants';
import { updateUserDetails } from '../redux/actions/user';

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
    case C.SERVER_DELETED: {
      const { serverId } = payload;
      const isSameServerOpened = window.location.pathname.includes(`/channels/${serverId}`);
      const serverToDelete = yield select((state) => getServerDetails(state, serverId));
      if (serverToDelete) {
        // if not this server, already deleted
        const { name } = serverToDelete;
        toast.info(`${name} server has been deleted`);

        if (isSameServerOpened) {
          yield put(setNavigateState(['/', { replace: true }]));
        }
        yield put(deleteServerSuccess(serverId));
      }
      break;
    }
    case C.SERVER_CHANNEL_CREATED: {
      const { channel } = payload;
      yield put(addChannelSuccess(channel.serverId, channel));
      break;
    }
    case C.SERVER_CHANNEL_DELETED: {
      const { serverId, channelId } = payload;
      const isSameChannelOpened = window.location.pathname.includes(`/channels/${serverId}/${channelId}`);

      if (isSameChannelOpened === channelId) {
        yield put(setNavigateState([`/channels/${serverId}`, { replace: true }]));
      }
      yield put(deleteChannelSuccess(serverId, channelId));
      break;
    }
    case C.USER_DETAILS_UPDATED: {
      const { userId } = payload;
      if (userId === loggedInUser.id) {
        yield put(updateUserDetails(payload));
      }
      break;
    }
    case C.SERVER_MEMBER_ROLE_UPDATED: {
      const { serverId, userId, role } = payload;
      yield put(updateServerRoleSuccess(serverId, { userId, role }));
      break;
    }
    case C.NEW_SERVER_MEMBER_JOINED: {
      const { server, newMember } = payload;
      if (newMember.userId === loggedInUser.id) {
        // we joined some new server, might be from some other device
        // so add server in redux state
        yield put(saveAllChannels(server.id, server.channels ?? []));
        yield put(joinServerSucess(server.id, undefined, server));
        break;
      }
      yield put(newServerMemberJoined(server.id, newMember));
      break;
    }
    default:
      break;
  }
}

function* socketEventSaga() {
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

function* socketDispatchSaga() {
  const allServers = yield select((state) => getAllServers(state));
  socketHandler.connectAllServers(Object.keys(allServers));
}

export default function* socketSaga() {
  yield all([
    fork(socketEventSaga),
    takeEvery(INTERNET_RECONNECTED, socketDispatchSaga),
  ]);
}
