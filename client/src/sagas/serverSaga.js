import {
  all, call, put, takeEvery, takeLatest,
} from 'redux-saga/effects';
import axiosInstance from '../utils/axiosConfig';
import { JOIN_SERVER_REQUESTED, SERVER_DETAILS_REQUESTED } from '../constants/servers';
import {
  joinServerFailed, joinServerSucess, serverDetailsFailed, serverDetailsSuccess,
} from '../redux/actions/servers';
import { handleError } from '../utils/helperFunctions';
import { ServerApi } from '../utils/apiEndpoints';

function* getServerDetails(actionData) {
  const { serverId } = actionData.payload;
  try {
    const url = `${ServerApi.GET_SERVER_DETAILS}/${serverId}`;
    const response = yield call(axiosInstance.get, url);
    yield put(serverDetailsSuccess(response.data));
  } catch (err) {
    yield put(
      handleError(err, (error) => serverDetailsFailed(serverId, error)),
    );
  }
}

function* joinServer(actionData) {
  const { server, inviteLink } = actionData.payload;
  const { id: serverId } = server;

  try {
    let url = `${ServerApi.JOIN_SERVER}?serverId=${serverId}`;
    if (inviteLink) url = `${url}&inviteLink=${inviteLink}`;

    yield call(axiosInstance.post, url);
    yield put(joinServerSucess(serverId, server));
  } catch (err) {
    yield put(
      handleError(err, (error) => joinServerFailed(serverId, error)),
    );
  }
}

export default function* serverSaga() {
  yield all([
    takeEvery(SERVER_DETAILS_REQUESTED, getServerDetails),
    takeLatest(JOIN_SERVER_REQUESTED, joinServer),
  ]);
}
