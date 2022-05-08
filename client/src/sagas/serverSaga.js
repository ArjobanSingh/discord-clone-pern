import {
  all, call, put, takeEvery, takeLatest,
} from 'redux-saga/effects';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosConfig';
import {
  CREATE_SERVER_REQUESTED,
  EXPLORE_SERVERS_REQUESTED,
  JOIN_SERVER_REQUESTED,
  SERVER_DETAILS_REQUESTED,
  UPDATE_SERVER_OWNERSHIP_REQUESTED,
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
  updateOwnershipFailed,
  updateOwnershipSuccess,
  updateServerFailed,
  updateServerRoleSuccess,
  updateServerSuccess,
} from '../redux/actions/servers';
import { handleError } from '../utils/helperFunctions';
import { ServerApi } from '../utils/apiEndpoints';
import { setNavigateState } from '../redux/actions/navigate';
import { getServerDetails as getServerState } from '../redux/reducers';
import { saveAllChannels } from '../redux/actions/channels';
import socketClient from '../services/socket-client';

function* getServerDetails(actionData) {
  const { serverId, isExploringServer } = actionData.payload;
  try {
    const url = `${ServerApi.GET_SERVER}/${serverId}`;
    const response = yield call(axiosInstance.get, url);
    yield put(saveAllChannels(serverId, response.data.channels ?? []));
    yield put(serverDetailsSuccess(response.data, isExploringServer));
  } catch (err) {
    yield put(handleError(err, (error, { status: errStatus }) => (
      serverDetailsFailed(serverId, isExploringServer, { ...error, errStatus })
    )));
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
    socketClient.connectSingleServer(serverId);
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
    const formData = new FormData();
    const {
      name, description, type, file,
    } = data;
    formData.append('name', name);
    formData.append('type', type);
    if (description) formData.append('description', description);
    if (file?.originalFile) formData.append('avatar', file.originalFile);

    console.log({ formData });
    const response = yield call(axiosInstance.post, url, formData);
    yield put(saveAllChannels(response.data.id, response.data.channels ?? []));
    yield put(createServerSuccess(response.data.id, response.data));
    yield put(setNavigateState([`/channels/${response.data.id}`]));
    socketClient.connectSingleServer(response.data.id);
    if (file?.fileUrl) URL.revokeObjectURL(file.fileUrl);
  } catch (err) {
    yield put(
      handleError(err, (error) => {
        console.log('Error', uniqueIdentifier);
        return createServerFailed(error, uniqueIdentifier);
      }),
    );
  }
}

const setFileToFormData = (formData, key, fileObj) => {
  // originalFile will only be present while adding new file or updating file
  if (fileObj.originalFile) {
    formData.append(key, fileObj.originalFile);
    return;
  }

  // if originalFile was not there, but url is present
  // means no changes in file, just add previous file url
  if (fileObj.fileUrl) {
    formData.append(key, fileObj.fileUrl);
  }

  // if nothing of those two added means either file removed
  // or already was not present, do not set it in formData
};

function* updateServer(actionData) {
  const { data, serverId } = actionData.payload;
  const {
    name, type, description, banner, avatar,
  } = data;
  try {
    const url = ServerApi.UPDATE_SERVER;

    const formData = new FormData();
    formData.append('id', serverId);
    formData.append('name', name);
    formData.append('type', type);
    formData.append('description', description);
    setFileToFormData(formData, 'banner', banner);
    setFileToFormData(formData, 'avatar', avatar);

    const response = yield call(axiosInstance.put, url, formData);
    yield put(updateServerSuccess(serverId, response.data));
  } catch (err) {
    yield put(
      handleError(err, (error) => {
        toast.error(error.message || 'Something went wrong while updating server details');
        return updateServerFailed(serverId, error);
      }),
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
    yield put(
      handleError(err, (error) => {
        toast.error(`Error: ${error.message}`);
        return {}; // no error action for this
      }),
    );
  }
}

function* transferOwnership(actionData) {
  const { userId, serverId } = actionData.payload;
  try {
    const url = `${ServerApi.TRANSFER_OWNERSHIP}/${serverId}`;
    const response = yield call(axiosInstance.patch, url, { newOwnerId: userId });
    yield put(updateOwnershipSuccess(response.data.serverId, response.data));
  } catch (err) {
    yield put(handleError(err, (error) => {
      toast.error(`Error updating owner: ${error.message}`);
      return updateOwnershipFailed(serverId, error.message);
    }));
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
    takeEvery(UPDATE_SERVER_OWNERSHIP_REQUESTED, transferOwnership),
  ]);
}
