import { all, fork, race } from 'redux-saga/effects';
import authSaga from './authSaga';

export default function* rootSaga() {
  // yield race([
  //   take(AUTH_LOGOUT_SUCCESS),
  //   all([
  //   fork(authSaga),

  //   ])
  // ])
  yield all([
    fork(authSaga),
  ]);
}
