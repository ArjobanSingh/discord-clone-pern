import {
  all, fork, cancel, take, race, call,
} from 'redux-saga/effects';
// import { AUTH_SIGN_IN_REQUESTED, AUTH_SIGN_OUT_SUCCESS } from '../constants/auth';
import authSaga from './authSaga';

export default function* rootSaga() {
  // yield race([
  //   take(AUTH_SIGN_OUT_SUCCESS),
  //   all([
  //     fork(authSaga),
  //   ]),
  // ]);

  yield all([
    fork(authSaga),
  ]);
}

// function* main2() {
//   yield race([
//     [
//       call(authSaga),
//     ],
//     take(AUTH_SIGN_OUT_SUCCESS),
//   ]);
// }

// function* main() {
//   // starts the root saga on sign in request
//   while (yield take(AUTH_SIGN_IN_REQUESTED)) {
//     const watcher = yield all([
//       fork(authSaga),
//     ]);

//     // wait for the user to sign out
//     yield take(AUTH_SIGN_OUT_SUCCESS);
//     // user logged out successfully. cancel the background task
//     yield watcher.map((task) => cancel(task));

//     // finally {
//     //   if (yield cancelled()) {
//     //     // ... put special cancellation handling code here
//     //   }
//     // }
//   }
// }
