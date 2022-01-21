import * as C from '../../constants/servers';

export const saveAllServers = (servers) => ({
  type: C.SAVE_ALL_SERVERS_LIST,
  payload: {
    servers,
  },
});

export const serverDetailsRequested = (serverId, isExploringServer) => ({
  type: C.SERVER_DETAILS_REQUESTED,
  payload: {
    serverId,
    isExploringServer,
  },
});

export const serverDetailsFailed = (serverId, isExploringServer, error) => ({
  type: C.SERVER_DETAILS_FAILED,
  payload: {
    serverId,
    isExploringServer,
    error,
  },
});

export const serverDetailsSuccess = (data, isExploringServer) => ({
  type: C.SERVER_DETAILS_SUCCESS,
  payload: {
    data,
    isExploringServer,
  },
});

export const removeServer = (serverId) => ({
  type: C.REMOVE_SERVER,
  payload: { serverId },
});

export const saveUrl = (payload) => ({
  type: C.SAVE_INVITE_URL,
  payload,
});

export const joinServerRequested = (server, inviteLink) => ({
  type: C.JOIN_SERVER_REQUESTED,
  payload: { server, inviteLink },
});

export const joinServerFailed = (serverId, error) => ({
  type: C.JOIN_SERVER_FAILED,
  payload: { serverId, error },
});

export const joinServerSucess = (serverId, data) => ({
  type: C.JOIN_SERVER_SUCCESS,
  payload: { serverId, data },
});

export const exploreServersRequested = () => ({
  type: C.EXPLORE_SERVERS_REQUESTED,
});

export const exploreServersFailed = (error) => ({
  type: C.EXPLORE_SERVERS_FAILED,
  payload: { error },
});

export const exploreServersSuccess = (data) => ({
  type: C.EXPLORE_SERVERS_SUCCESS,
  payload: { data },
});

export const exploreServerDataRequested = (data) => ({
  type: C.EXPLORE_SERVER_DATA_REQUESTED,
  payload: { data },
});
