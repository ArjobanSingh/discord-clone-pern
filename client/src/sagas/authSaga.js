import {
  takeLatest, all, call, put, fork,
} from 'redux-saga/effects';
import { AUTH_REGISTER_REQUESTED, AUTH_SIGN_IN_REQUESTED, AUTH_SIGN_OUT_REQUESTED } from '../constants/auth';
import {
  logoutSuccess,
  registrationFailed, registrationSuccess, signInFailed, signInSuccess,
} from '../redux/actions/auth';
import { setNavigateState } from '../redux/actions/navigate';
import { saveAllServers } from '../redux/actions/servers';
import { userSuccess } from '../redux/actions/user';
import { AuthApi } from '../utils/apiEndpoints';
import axiosInstance, { getAuthTokens, removeTokens, setTokens } from '../utils/axiosConfig';
import socketClient from '../services/socket-client';

function* loginUser(actionData) {
  const { credentials, fromLocation } = actionData.payload;
  try {
    const response = yield call(axiosInstance.post, AuthApi.LOGIN, credentials);
    const { accessToken, refreshToken, user } = response.data;
    setTokens(accessToken, refreshToken);
    yield put(signInSuccess());

    const { servers, ...restUserData } = user;
    yield put(saveAllServers(servers));
    yield put(userSuccess(restUserData));
    yield put(setNavigateState([fromLocation, { replace: true }]));
    socketClient.connectAllServers(servers.map((server) => server.serverId));
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
    const [accessToken, refreshToken] = getAuthTokens();
    const authHeaders = {
      'access-token': accessToken,
      'refresh-token': refreshToken,
    };
    // getting tokens explicitly here, before making logout request, as when axiosInstance's
    // getAuthTokens will be called, auth tokens will be cleared from localStorage
    // because fork is non-blocking function, as we want to logout user on UI instantly
    // irrespective of api response, so clearing tokens and dispatching logoutSuccess
    // instantly after non-blocking fork function
    yield fork(axiosInstance.delete, AuthApi.LOGOUT, { headers: authHeaders });
    removeTokens();
    yield put(logoutSuccess());
    // yield put(setNavigateState(['/login', { replace: true }]));
  } catch (err) {
    // console.log(err.message);
  }
}

function* registerUser(actionData) {
  const { credentials, fromLocation } = actionData.payload;
  try {
    const response = yield call(axiosInstance.post, AuthApi.REGISTER, credentials);
    const { accessToken, refreshToken, user } = response.data;
    setTokens(accessToken, refreshToken);
    yield put(registrationSuccess());

    const { servers, ...restUserData } = user;
    yield put(saveAllServers(servers));
    yield put(userSuccess(restUserData));
    yield put(setNavigateState([fromLocation, { replace: true }]));
  } catch (err) {
    console.log('register error', err.response, err.message);
    if (err.response?.data) {
      const { error } = err.response.data;
      yield put(registrationFailed(error));
    } else yield put(registrationFailed({ message: err.message }));
  }
}

// finally {
//   if (yield cancelled()) {
//     // ... put special cancellation handling code here
//   }
// }

export default function* authSaga() {
  yield all([
    takeLatest(AUTH_SIGN_IN_REQUESTED, loginUser),
    takeLatest(AUTH_REGISTER_REQUESTED, registerUser),
    takeLatest(AUTH_SIGN_OUT_REQUESTED, logoutUser),
  ]);
}
