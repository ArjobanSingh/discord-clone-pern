import * as C from '../../constants/servers';

export const saveAllServers = (servers) => ({
  type: C.SAVE_ALL_SERVERS_LIST,
  payload: {
    servers,
  },
});

export const serverDetailsRequested = (serverId) => ({
  type: C.SERVER_DETAILS_REQUESTED,
  payload: {
    serverId,
  },
});

export const serverDetailsFailed = (serverId, error) => ({
  type: C.SERVER_DETAILS_FAILED,
  payload: {
    serverId,
    error,
  },
});

export const serverDetailsSuccess = (data) => ({
  type: C.SERVER_DETAILS_SUCCESS,
  payload: {
    data,
  },
});

export const addServer = (data) => ({
  type: C.ADD_SERVER,
  payload: {
    data,
  },
});

export const removeServer = (serverId) => ({
  type: C.REMOVE_SERVER,
  payload: { serverId },
});
