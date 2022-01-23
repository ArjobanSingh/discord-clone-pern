import {
  all, call, put, takeEvery, takeLatest,
} from 'redux-saga/effects';
import axiosInstance from '../utils/axiosConfig';
import {
  CREATE_SERVER_REQUESTED,
  EXPLORE_SERVERS_REQUESTED,
  JOIN_SERVER_REQUESTED,
  SERVER_DETAILS_REQUESTED,
} from '../constants/servers';
import {
  createServerFailed,
  createServerSuccess,
  exploreServersFailed,
  exploreServersSuccess,
  joinServerFailed,
  joinServerSucess,
  serverDetailsFailed,
  serverDetailsSuccess,
} from '../redux/actions/servers';
import { handleError } from '../utils/helperFunctions';
import { ServerApi } from '../utils/apiEndpoints';
import { setNavigateState } from '../redux/actions/navigate';

function* getServerDetails(actionData) {
  const { serverId, isExploringServer } = actionData.payload;
  try {
    const url = `${ServerApi.GET_SERVER}/${serverId}`;
    const response = yield call(axiosInstance.get, url);
    yield put(serverDetailsSuccess(response.data, isExploringServer));
  } catch (err) {
    yield put(
      handleError(
        err,
        (error, { status: errStatus }) => (
          serverDetailsFailed(serverId, isExploringServer, { ...error, errStatus })
        ),
      ),
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

function* getPublicServers() {
  try {
    const url = ServerApi.GET_SERVER;
    const response = yield call(axiosInstance.get, url);
    yield put(exploreServersSuccess(response.data));
  } catch (err) {
    yield put(
      handleError(err, (error) => exploreServersFailed(error)),
    );
  }
}

function* createServer(actionData) {
  const { data, uniqueIdentifier } = actionData.payload;
  try {
    const url = ServerApi.CREATE_SERVER;
    const response = yield call(axiosInstance.post, url, data);
    console.log({ response });
    yield put(createServerSuccess(response.data.id, response.data));
    yield put(setNavigateState([`/channels/${response.data.id}`]));
  } catch (err) {
    yield put(
      handleError(err, (error) => {
        console.log('Error', uniqueIdentifier);
        return createServerFailed(error, uniqueIdentifier);
      }),
    );
  }
}

export default function* serverSaga() {
  yield all([
    takeEvery(SERVER_DETAILS_REQUESTED, getServerDetails),
    takeLatest(JOIN_SERVER_REQUESTED, joinServer),
    takeLatest(EXPLORE_SERVERS_REQUESTED, getPublicServers),
    takeEvery(CREATE_SERVER_REQUESTED, createServer),
  ]);
}
