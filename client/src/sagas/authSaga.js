import {
  takeLatest, all, call, put, fork,
} from 'redux-saga/effects';
import { AUTH_REGISTER_REQUESTED, AUTH_SIGN_IN_REQUESTED, AUTH_SIGN_OUT_REQUESTED } from '../constants/auth';
import {
  logoutSuccess,
  registrationFailed, registrationSuccess, signInFailed, signInSuccess,
} from '../redux/actions/auth';
import { userSuccess } from '../redux/actions/user';
import { AuthApi } from '../utils/apiEndpoints';
import axiosInstance, { getAuthTokens, removeTokens, setTokens } from '../utils/axiosConfig';

function* loginUser(actionData) {
  const { payload } = actionData;
  try {
    const response = yield call(axiosInstance.post, AuthApi.LOGIN, payload);
    const { accessToken, refreshToken, user } = response.data;
    setTokens(accessToken, refreshToken);
    yield put(signInSuccess());
    yield put(userSuccess(user));
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
  } catch (err) {
    // console.log(err.message);
  }
}

function* registerUser(actionData) {
  const { payload } = actionData;
  try {
    const response = yield call(axiosInstance.post, AuthApi.REGISTER, payload);
    const { accessToken, refreshToken, user } = response.data;
    setTokens(accessToken, refreshToken);
    yield put(registrationSuccess());
    yield put(userSuccess(user));
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