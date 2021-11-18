import { takeEvery, all } from 'redux-saga/effects';
import { AUTH_SIGN_IN_REQUESTED } from '../constants/auth';

function* loginUser(actionData) {
  // Todo
}

export default function* authSaga() {
  yield all([
    takeEvery(AUTH_SIGN_IN_REQUESTED, loginUser),
  ]);
}
