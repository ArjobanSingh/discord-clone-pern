import {
  all, fork, cancel, take,
} from 'redux-saga/effects';
import { AUTH_SIGN_OUT_SUCCESS } from '../constants/auth';
import authSaga from './authSaga';
import userSaga from './userSaga';
import serverSaga from './serverSaga';
import socketSaga from './socket';
import channelSaga from './channelSaga';

export default function* main() {
  // this will automatically start/restart saga as needed
  while (true) {
    const watchers = yield all([
      fork(authSaga),
      fork(userSaga),
      fork(serverSaga),
      fork(socketSaga),
      fork(channelSaga),
    ]);

    // wait for the user to sign out
    yield take(AUTH_SIGN_OUT_SUCCESS);
    // user logged out successfully. cancel all the background tasks
    yield cancel(watchers);
  }
}
