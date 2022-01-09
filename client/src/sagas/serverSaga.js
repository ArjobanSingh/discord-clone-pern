import {
  all, call, put, takeEvery,
} from 'redux-saga/effects';
import axiosInstance from '../utils/axiosConfig';
import { SERVER_DETAILS_REQUESTED } from '../constants/servers';
import { serverDetailsFailed, serverDetailsSuccess } from '../redux/actions/servers';
import { handleError } from '../utils/helperFunctions';
import { ServerApi } from '../utils/apiEndpoints';

function* getServerDetails(actionData) {
  const { serverId } = actionData.payload;
  try {
    const url = `${ServerApi.GET_SERVER_DETAILS}/${serverId}`;
    const response = yield call(axiosInstance.get, url);
    console.log({ response });
    yield put(serverDetailsSuccess(response.data));
  } catch (err) {
    yield put(
      handleError(err, (error) => serverDetailsFailed(serverId, error)),
    );
  }
}

export default function* serverSaga() {
  yield all([
    takeEvery(SERVER_DETAILS_REQUESTED, getServerDetails),
  ]);
}
