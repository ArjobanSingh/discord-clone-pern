import {
  takeLatest, all, call, put,
} from 'redux-saga/effects';
import * as C from '../constants/user';
import { logoutSuccess } from '../redux/actions/auth';
import { saveAllServers } from '../redux/actions/servers';
import { userFailed, userSuccess } from '../redux/actions/user';
import { UserApi } from '../utils/apiEndpoints';
import axiosInstance from '../utils/axiosConfig';

function* fetchCurrentUser() {
  try {
    const response = yield call(axiosInstance.get, UserApi.GET_CURRENT_USER);
    const { servers, ...restUserData } = response.data;
    yield put(userSuccess(restUserData));
    yield put(saveAllServers(servers));
  } catch (err) {
    console.log('User error', err.response, err.message);
    if (err.response) {
      const { status, data } = err.response;
      if (status === 401) {
        // session-expired: log user out
        console.log('Refresh token error', err);
        yield put(logoutSuccess());
      } else yield put(userFailed(data.error));
    } else yield put(userFailed({ message: err.message }));
  }
}

export default function* userSaga() {
  yield all([
    takeLatest(C.USER_REQUESTED, fetchCurrentUser),
  ]);
}
