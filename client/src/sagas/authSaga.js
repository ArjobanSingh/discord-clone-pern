/* eslint-disable require-yield */
import {
  takeLatest, all, call, cancelled, put,
} from 'redux-saga/effects';
import { AUTH_REGISTER_REQUESTED, AUTH_SIGN_IN_REQUESTED, AUTH_SIGN_OUT_SUCCESS } from '../constants/auth';
import {
  registrationFailed, registrationSuccess, signInFailed, signInSuccess,
} from '../redux/actions/auth';
import { setUser } from '../redux/actions/user';
import { AuthApi } from '../utils/apiEndpoints';
import axiosInstance from '../utils/axiosConfig';

const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem('access-token', `Bearer ${accessToken}`);
  localStorage.setItem('refresh-token', refreshToken);
};

function* loginUser(actionData) {
  const { payload } = actionData;
  try {
    const response = yield call(axiosInstance.post, AuthApi.Login, payload);
    const { accessToken, refreshToken, user } = response.data;
    setTokens(accessToken, refreshToken);
    yield put(signInSuccess());
    yield put(setUser(user));
  } catch (err) {
    console.log('Login error', err.response, err.message);
    if (err.response?.data) {
      const { error } = err.response.data;
      yield put(signInFailed(error));
    } else yield put(signInFailed({ message: err.message }));
  }
}

function* logoutUser(actionData) {
  console.log('Sign out requested');
}

function* registerUser(actionData) {
  const { payload } = actionData;
  try {
    const response = yield call(axiosInstance.post, AuthApi.Register, payload);
    console.log({ response });
    const { accessToken, refreshToken, user } = response.data;
    setTokens(accessToken, refreshToken);
    yield put(registrationSuccess());
    yield put(setUser(user));
  } catch (err) {
    console.log('register error', err.response, err.message);
    if (err.response?.data) {
      const { error } = err.response.data;
      yield put(registrationFailed(error));
    } else yield put(registrationFailed({ message: err.message }));
  }
}

function* longTask() {
  try {
    //
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
    takeLatest(AUTH_SIGN_IN_REQUESTED, loginUser),
    takeLatest(AUTH_REGISTER_REQUESTED, registerUser),
    takeLatest(AUTH_SIGN_OUT_SUCCESS, logoutUser),
  ]);
}
