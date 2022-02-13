import {
  all, call, put, select, takeEvery, takeLatest,
} from 'redux-saga/effects';
import axiosInstance from '../utils/axiosConfig';
import {
  CREATE_SERVER_REQUESTED,
  EXPLORE_SERVERS_REQUESTED,
  JOIN_SERVER_REQUESTED,
  SERVER_DETAILS_REQUESTED,
  UPDATE_SERVER_REQUESTED,
  UPDATE_SERVER_ROLE_REQUESTED,
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
  updateServerFailed,
  updateServerRoleSuccess,
  updateServerSuccess,
} from '../redux/actions/servers';
import { handleError } from '../utils/helperFunctions';
import { ServerApi } from '../utils/apiEndpoints';
import { setNavigateState } from '../redux/actions/navigate';
import { getServerDetails as getServerState } from '../redux/reducers';

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
    yield put(setNavigateState([`/channels/${serverId}`, { replace: !!inviteLink }]));
  } catch (err) {
    if (!inviteLink) {
      // joining server while exploring public server, so also show notification error
      // TODO: add notification error
    }
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

function* updateServer(actionData) {
  const { data, serverId } = actionData.payload;
  try {
    const url = ServerApi.UPDATE_SERVER;
    const { _members, ...serverData } = yield select((state) => getServerState(state, serverId));
    const content = {
      ...serverData,
      ...data,
    };
    const response = yield call(axiosInstance.put, url, content);
    yield put(updateServerSuccess(serverId, response.data));
  } catch (err) {
    yield put(
      handleError(err, (error) => updateServerFailed(serverId, error)),
    );
  }
}

function* updateUserRoleInServer(actionData) {
  const { serverId, userId, role } = actionData.payload;
  try {
    const url = ServerApi.UPDATE_ROLE;
    yield call(axiosInstance.put, url, { role, userId, serverId });
    yield put(updateServerRoleSuccess(serverId, { userId, role }));
  } catch (err) {
    // TODO: handle notification error
    console.log('Update role error', err, err.message);
    yield put(
      handleError(err, (error) => updateServerFailed(serverId, error)),
    );
  }
}

export default function* serverSaga() {
  yield all([
    takeEvery(SERVER_DETAILS_REQUESTED, getServerDetails),
    takeEvery(JOIN_SERVER_REQUESTED, joinServer),
    takeLatest(EXPLORE_SERVERS_REQUESTED, getPublicServers),
    takeEvery(CREATE_SERVER_REQUESTED, createServer),
    takeEvery(UPDATE_SERVER_REQUESTED, updateServer),
    takeEvery(UPDATE_SERVER_ROLE_REQUESTED, updateUserRoleInServer),
  ]);
}
