/* eslint-disable require-yield */
import {
  takeEvery, all, call, cancelled,
} from 'redux-saga/effects';
import { AUTH_SIGN_IN_REQUESTED, AUTH_SIGN_OUT_SUCCESS } from '../constants/auth';
import axiosInstance from '../utils/axiosConfig';

const returnResponse = () => new Promise((r) => setTimeout(r, 2000));

function* loginUser(actionData) {
  console.log('Sign in reqeuested');
  // Todo
}

function* logoutUser(actionData) {
  console.log('Sign out requested');
}

function* longTask() {
  try {
    console.log('timeout started');
    yield call(returnResponse);
    console.log('timeout completed');
  } catch (err) {
    //
  } finally {
    if (yield cancelled()) {
      // ... put special cancellation handling code here
    }
  }
}

export default function* authSaga() {
  yield all([
    takeEvery(AUTH_SIGN_IN_REQUESTED, loginUser),
    takeEvery(AUTH_SIGN_OUT_SUCCESS, logoutUser),
    takeEvery('TEST_ACTION', longTask),
  ]);
}
