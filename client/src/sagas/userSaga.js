import {
  takeLatest, all, call, put,
} from 'redux-saga/effects';
import * as C from '../constants/user';
import { saveAllServers } from '../redux/actions/servers';
import { userFailed, userSuccess } from '../redux/actions/user';
import { UserApi } from '../utils/apiEndpoints';
import axiosInstance from '../utils/axiosConfig';
import { handleError } from '../utils/helperFunctions';
import socketClient from '../services/socket-client';

function* fetchCurrentUser() {
  try {
    const response = yield call(axiosInstance.get, UserApi.GET_CURRENT_USER);
    const { servers, ...restUserData } = response.data;
    yield put(saveAllServers(servers));
    yield put(userSuccess(restUserData));
    socketClient.connectAllServers(servers.map((server) => server.serverId));
  } catch (err) {
    console.log('User error', err.response, err.message);
    yield put(
      handleError(err, (error) => userFailed(error)),
    );
  }
}

export default function* userSaga() {
  yield all([
    takeLatest(C.USER_REQUESTED, fetchCurrentUser),
  ]);
}
