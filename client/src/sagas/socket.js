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
  createServerSuccess,
  deleteServerSuccess,
  joinServerSucess,
  kickServerMemberSuccess,
  leaveServerMemberSuccess,
  newServerMemberJoined,
  removePrivateServerFromExplore,
  updateOwnershipSuccess,
  updateServerRoleSuccess,
  updateServerSuccess,
} from '../redux/actions/servers';
import { setNavigateState } from '../redux/actions/navigate';
import { getAllServers, getServerDetails } from '../redux/reducers';
import { INTERNET_RECONNECTED } from '../constants';
import { updateUserDetails } from '../redux/actions/user';
import { logoutSuccess } from '../redux/actions/auth';
import { appendChannelNotifications } from '../redux/actions/notifications';

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

  // console.log('socket', event, payload);
  switch (event) {
    case C.SESSION_EXPIRED: {
      toast.error('Session expired, Please log in again');
      yield put(logoutSuccess());
      break;
    }
    case C.NEW_CHANNEL_MESSAGE: {
      const { serverId, channelId, userId } = payload;
      yield put(sendChannelMessageSent(serverId, channelId, undefined, payload));
      const isSameChannelOpened = window.location.pathname.includes(`/channels/${serverId}/${channelId}`);

      // only show notifications, if that channel already not opened
      // and also if sender is some other user
      if (!isSameChannelOpened && userId !== loggedInUser.id) {
        yield put(appendChannelNotifications(serverId, channelId));
      }
      break;
    }
    case C.SERVER_OWNER_TRANSFERRED: {
      const { serverId } = payload;
      yield put(updateOwnershipSuccess(serverId, payload));
      break;
    }
    case C.SERVER_USER_KICKED_OUT: {
      const { serverId, userId, userName } = payload;

      const { name } = yield select((state) => getServerDetails(state, serverId));
      const isLoggedInUser = userId === loggedInUser.id;
      const isSameServerOpened = window.location.pathname.includes(`/channels/${serverId}`);

      if (isLoggedInUser) {
        socketHandler.disconnectSingleServer(serverId);
        toast.info(`You have been kicked out from "${name}" server`);

        if (isSameServerOpened) {
          // if current user kicked out from server, and current opened
          // server is the same one, navigate user to index route
          yield put(setNavigateState(['/', { replace: true }]));
        }
      } else {
        toast.info(`"${userName}" has been kicked out from "${name}" server`);
      }
      yield put(kickServerMemberSuccess(serverId, userId, isLoggedInUser));
      break;
    }
    case C.SERVER_MEMBER_LEFT: {
      const { serverId, userId, userName } = payload;
      const isLoggedInUser = userId === loggedInUser.id;
      const isSameServerOpened = window.location.pathname.includes(`/channels/${serverId}`);
      if (isLoggedInUser) {
        socketHandler.disconnectSingleServer(serverId);

        if (isSameServerOpened) {
          yield put(setNavigateState(['/', { replace: true }]));
        }
      } else {
        const server = yield select((state) => getServerDetails(state, serverId));
        toast.info(`"${userName}" has left "${server.name}" server`);
      }
      // toast.info(`${name} server has been deleted`);
      yield put(leaveServerMemberSuccess(serverId, userId, isLoggedInUser));
      break;
    }
    case C.SERVER_DELETED: {
      const { serverId } = payload;
      const isSameServerOpened = window.location.pathname.includes(`/channels/${serverId}`);
      const serverToDelete = yield select((state) => getServerDetails(state, serverId));
      if (serverToDelete) {
        socketHandler.disconnectSingleServer(serverId);
        // if not this server, already deleted
        const { name } = serverToDelete;
        toast.info(`"${name}" server has been deleted`);
        // TODO: disconnect server

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
      const { id } = payload;
      if (id === loggedInUser.id) {
        yield put(updateUserDetails(payload));
      }
      break;
    }
    case C.SERVER_MEMBER_ROLE_UPDATED: {
      const { serverId, userId, role } = payload;
      const server = yield select((state) => getServerDetails(state, serverId));
      yield put(updateServerRoleSuccess(serverId, { userId, role }));

      if (userId === loggedInUser.id && server) {
        toast.info(`Your role updated to "${role}" role in "${server.name}" server`);
      }
      break;
    }
    case C.NEW_SERVER_MEMBER_JOINED: {
      const { server, newMember } = payload;
      if (newMember.userId === loggedInUser.id) {
        // we joined some new server, might be from some other device
        // so add server in redux state
        yield put(joinServerSucess(server.id, undefined, server));
        socketHandler.connectSingleServer(server.id);
        break;
      }
      yield put(newServerMemberJoined(server.id, newMember));
      toast.info(`New member added to "${server.name}" server`);
      break;
    }
    case C.SERVER_CREATED: {
      const { id, channels } = payload;
      yield put(saveAllChannels(id, channels ?? []));
      yield put(createServerSuccess(id, payload));
      socketHandler.connectSingleServer(id);
      break;
    }
    case C.SERVER_UPDATED: {
      const { id } = payload;
      yield put(updateServerSuccess(id, payload));
      break;
    }
    case C.SERVER_UPDATED_TO_PRIVATE: {
      const { serverId } = payload;
      yield put(removePrivateServerFromExplore(serverId));
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
