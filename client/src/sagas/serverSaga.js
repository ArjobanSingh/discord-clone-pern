import {
  all, call, put, takeEvery, takeLatest, select,
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
  KICK_SERVER_MEMBER_REQUESTED,
  LEAVE_SERVER_MEMBER_REQUESTED,
  DELETE_SERVER_REQUESTED,
  EXPLORE_MORE_SERVERS_REQUESTED,
} from '../constants/servers';
import {
  createServerFailed,
  createServerSuccess,
  deleteServerSuccess,
  exploreMoreServersFailed,
  exploreMoreServersSuccess,
  exploreServersFailed,
  exploreServersSuccess,
  joinServerFailed,
  joinServerSucess,
  kickServerMemberFailed,
  kickServerMemberSuccess,
  leaveServerMemberFailed,
  leaveServerMemberSuccess,
  serverDetailsFailed,
  serverDetailsSuccess,
  updateOwnershipFailed,
  updateOwnershipSuccess,
  updateServerFailed,
  updateServerRoleSuccess,
  updateServerSuccess,
} from '../redux/actions/servers';
// import { getServerDetails as getServerState } from '../redux/reducers';
import { handleError } from '../utils/helperFunctions';
import { ServerApi } from '../utils/apiEndpoints';
import { setNavigateState } from '../redux/actions/navigate';
import { saveAllChannels } from '../redux/actions/channels';
import socketClient from '../services/socket-client';
import { getExploreServersList } from '../redux/reducers';

async function fetchServerDetails(serverId, throwError = true) {
  try {
    const url = `${ServerApi.GET_SERVER}/${serverId}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (err) {
    if (throwError) throw err;
    return null;
  }
}

function* getServerDetails(actionData) {
  const { serverId, isExploringServer } = actionData.payload;
  try {
    const server = yield call(fetchServerDetails, serverId);
    yield put(saveAllChannels(serverId, server.channels ?? []));
    yield put(serverDetailsSuccess(server, isExploringServer));
  } catch (err) {
    yield put(handleError(err, (error, originalError) => {
      const errStatus = originalError?.response?.status || originalError.status;
      return (
        serverDetailsFailed(serverId, isExploringServer, { ...error, status: errStatus })
      );
    }));
  }
}

function* joinServer(actionData) {
  // in case of inviteId, server.id can be undefined
  // but it does not matter than, cause in case of invite id
  // server.id is not required at backend
  const { server, inviteId } = actionData.payload;
  let { id: serverId } = server;

  try {
    let url = `${ServerApi.JOIN_SERVER}?serverId=${serverId}`;
    if (inviteId) url = `${url}&inviteLink=${inviteId}`;

    const response = yield call(axiosInstance.post, url);
    const latestServerDetails = response.data;
    serverId = latestServerDetails.id;

    yield put(saveAllChannels(serverId, latestServerDetails.channels ?? []));
    yield put(joinServerSucess(serverId, inviteId, latestServerDetails));
    yield put(setNavigateState([`/channels/${serverId}`, { replace: !!inviteId }]));
    socketClient.connectSingleServer(serverId);

    // let latestServerDetails = yield call(fetchServerDetails, serverId, false);
    // if (latestServerDetails) {
    //   // update channels with latest server channels we got from api
    //   yield put(saveAllChannels(serverId, latestServerDetails.channels ?? []));
    // } else {
    //   // for some reason fetch server details api failed, just append
    //   // our newly added member to old server details we have, which
    //   // we got while exploring this public server
    //   const { name, id, profilePicture } = yield select((state) => getUser(state).user);
    //   const ourMemberDetails = {
    //     userName: name,
    //     userId: id,
    //     profilePicture,
    //     role: ServerMemberRoles.USER,
    //   };
    //   latestServerDetails = {
    //     ...server,
    //     members: [...server.members, ourMemberDetails],
    //   };
    // }
  } catch (err) {
    yield put(
      handleError(err, (error) => {
        if (!inviteId) {
          // joining server while exploring public server, so also show notification error
          toast.error(`Error joining server ${error.message}`);
        }
        return joinServerFailed(serverId, inviteId, error);
      }),
    );
  }
}

const FETCH_PUBLIC_SERVERS_LIMIT = 50;
function* getPublicServers() {
  try {
    const url = ServerApi.GET_SERVER;
    const response = yield call(axiosInstance.get, url);
    yield put(exploreServersSuccess(
      response.data,
      response.data.length >= FETCH_PUBLIC_SERVERS_LIMIT,
    ));
  } catch (err) {
    yield put(
      handleError(err, (error) => exploreServersFailed(error)),
    );
  }
}

function* getMorePublicServers() {
  try {
    const { data } = yield select(getExploreServersList);
    const lastServer = data[data.length - 1];
    const encodedCreatedAt = encodeURIComponent(lastServer.createdAt);
    const url = `${ServerApi.GET_SERVER}?cursor=${encodedCreatedAt}&limit=${FETCH_PUBLIC_SERVERS_LIMIT}`;
    const response = yield call(axiosInstance.get, url);
    yield put(exploreMoreServersSuccess(
      response.data,
      response.data.length >= FETCH_PUBLIC_SERVERS_LIMIT,
    ));
  } catch (err) {
    yield put(handleError(err, (error) => {
      toast.error(`Error fetching more servers: ${error.message}`);
      return exploreMoreServersFailed();
    }));
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

function setFileToFormData(formData, key, fileObj) {
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
}

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

function* kickServerMember(actionData) {
  const { userId, serverId } = actionData.payload;
  try {
    const { user: loggedInUser } = yield select((state) => state.user);
    const url = `${ServerApi.KICK_MEMBER}/${serverId}/${userId}`;
    yield call(axiosInstance.delete, url);
    const isLoggedInUser = userId === loggedInUser.id;

    // although here user cannot kick himself, but leave server
    // which is handled in other saga
    const isSameServerOpened = window.location.pathname.includes(`/channels/${serverId}`);
    if (isLoggedInUser && isSameServerOpened) {
      // if current user kicked out from server, and current opened
      // server is the same one, navigate user to index route
      yield put(setNavigateState(['/', { replace: true }]));
    }
    yield put(kickServerMemberSuccess(serverId, userId, isLoggedInUser));
  } catch (err) {
    yield put(handleError(err, (error) => {
      toast.error(`Error Kicking user: ${error.message}`);
      return kickServerMemberFailed(serverId, error.message);
    }));
  }
}

function* leaveServer(actionData) {
  const { serverId } = actionData.payload;
  try {
    const { user } = yield select((state) => state.user);
    const url = `${ServerApi.LEAVE_SERVER}/${serverId}`;
    yield call(axiosInstance.delete, url);
    const isSameServerOpened = window.location.pathname.includes(`/channels/${serverId}`);
    if (isSameServerOpened) {
      yield put(setNavigateState(['/', { replace: true }]));
    }
    yield put(leaveServerMemberSuccess(serverId, user.userId, true));
    socketClient.disconnectSingleServer(serverId);
  } catch (err) {
    yield put(handleError(err, (error) => {
      toast.error(`Error leaving server: ${error.message}`);
      return leaveServerMemberFailed(serverId, error.message);
    }));
  }
}

function* deleteServer(actionData) {
  const { serverId } = actionData.payload;
  try {
    const url = `${ServerApi.DELETE_SERVER}/${serverId}`;
    yield call(axiosInstance.delete, url);
    const isSameServerOpened = window.location.pathname.includes(`/channels/${serverId}`);
    if (isSameServerOpened) {
      yield put(setNavigateState(['/', { replace: true }]));
    }
    yield put(deleteServerSuccess(serverId));
    socketClient.disconnectSingleServer(serverId);
  } catch (err) {
    yield put(handleError(err, (error) => {
      toast.error(`Error Deleting server: ${error.message}`);
      return {};
    }));
  }
}
export default function* serverSaga() {
  yield all([
    takeEvery(SERVER_DETAILS_REQUESTED, getServerDetails),
    takeEvery(JOIN_SERVER_REQUESTED, joinServer),
    takeLatest(EXPLORE_SERVERS_REQUESTED, getPublicServers),
    takeEvery(EXPLORE_MORE_SERVERS_REQUESTED, getMorePublicServers),
    takeEvery(CREATE_SERVER_REQUESTED, createServer),
    takeEvery(UPDATE_SERVER_REQUESTED, updateServer),
    takeEvery(UPDATE_SERVER_ROLE_REQUESTED, updateUserRoleInServer),
    takeEvery(UPDATE_SERVER_OWNERSHIP_REQUESTED, transferOwnership),
    takeEvery(KICK_SERVER_MEMBER_REQUESTED, kickServerMember),
    takeEvery(LEAVE_SERVER_MEMBER_REQUESTED, leaveServer),
    takeEvery(DELETE_SERVER_REQUESTED, deleteServer),
  ]);
}
