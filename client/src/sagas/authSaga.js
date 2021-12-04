import {
  takeLatest, all, call, cancelled, put,
} from 'redux-saga/effects';
import { AUTH_REGISTER_REQUESTED, AUTH_SIGN_IN_REQUESTED, AUTH_SIGN_OUT_REQUESTED } from '../constants/auth';
import {
  logoutSuccess,
  registrationFailed, registrationSuccess, signInFailed, signInSuccess,
} from '../redux/actions/auth';
import { setUser } from '../redux/actions/user';
import { AuthApi } from '../utils/apiEndpoints';
import axiosInstance from '../utils/axiosConfig';

const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem('access-token', `Bearer ${accessToken}`);
  localStorage.setItem('refresh-token', refreshToken);
};

const removeTokens = () => {
  localStorage.removeItem('access-token');
  localStorage.removeItem('refresh-token');
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

function* logoutUser() {
  try {
    yield call(axiosInstance.delete, AuthApi.Logout);
  } finally {
    // even if api fails logout
    // TODO: need to update the logic for logging out user instantly
    removeTokens();
    yield put(logoutSuccess());
    // if (yield cancelled()) {
    //   // ... put special cancellation handling code here
    // }
  }
}

function* registerUser(actionData) {
  const { payload } = actionData;
  try {
    const response = yield call(axiosInstance.post, AuthApi.Register, payload);
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

export default function* authSaga() {
  yield all([
    takeLatest(AUTH_SIGN_IN_REQUESTED, loginUser),
    takeLatest(AUTH_REGISTER_REQUESTED, registerUser),
    takeLatest(AUTH_SIGN_OUT_REQUESTED, logoutUser),
  ]);
}
