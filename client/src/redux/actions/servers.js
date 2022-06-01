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

export const joinServerRequested = (server, inviteId) => ({
  type: C.JOIN_SERVER_REQUESTED,
  payload: { server, inviteId },
});

export const joinServerFailed = (serverId, inviteId, error) => ({
  type: C.JOIN_SERVER_FAILED,
  payload: { serverId, inviteId, error },
});

export const joinServerSucess = (serverId, inviteId, data) => ({
  type: C.JOIN_SERVER_SUCCESS,
  payload: { serverId, inviteId, data },
});

export const exploreServersRequested = () => ({
  type: C.EXPLORE_SERVERS_REQUESTED,
});

export const exploreServersFailed = (error) => ({
  type: C.EXPLORE_SERVERS_FAILED,
  payload: { error },
});

export const exploreServersSuccess = (data, hasMore) => ({
  type: C.EXPLORE_SERVERS_SUCCESS,
  payload: { data, hasMore },
});

export const exploreMoreServersRequested = () => ({
  type: C.EXPLORE_MORE_SERVERS_REQUESTED,
});

export const exploreMoreServersSuccess = (data, hasMore) => ({
  type: C.EXPLORE_MORE_SERVERS_SUCCESS,
  payload: {
    data,
    hasMore,
  },
});

export const exploreMoreServersFailed = () => ({
  type: C.EXPLORE_MORE_SERVERS_FAILED,
});

export const addExploreServerData = (data) => ({
  type: C.ADD_EXPLORE_SERVER_DATA,
  payload: { data },
});

export const resetExploreServerData = (serverId) => ({
  type: C.RESET_EXPLORE_SERVER,
  payload: {
    serverId,
  },
});

export const createServerRequested = (data, uniqueIdentifier) => ({
  type: C.CREATE_SERVER_REQUESTED,
  payload: { data, uniqueIdentifier },
});

export const createServerFailed = (error, uniqueIdentifier) => ({
  type: C.CREATE_SERVER_FAILED,
  payload: { error, uniqueIdentifier },
});

export const createServerSuccess = (serverId, data) => ({
  type: C.CREATE_SERVER_SUCCESS,
  payload: { data, serverId },
});

export const createServerReset = () => ({
  type: C.CREATE_SERVER_RESET,
});

export const updateServerRequested = (serverId, data) => ({
  type: C.UPDATE_SERVER_REQUESTED,
  payload: {
    serverId,
    data,
  },
});

export const updateServerSuccess = (serverId, data) => ({
  type: C.UPDATE_SERVER_SUCCESS,
  payload: {
    serverId,
    data,
  },
});

export const updateServerFailed = (serverId, error) => ({
  type: C.UPDATE_SERVER_FAILED,
  payload: {
    serverId,
    error,
  },
});

export const updateServerRoleRequested = (payload) => ({
  type: C.UPDATE_SERVER_ROLE_REQUESTED,
  payload,
});

export const updateServerRoleSuccess = (serverId, data) => ({
  type: C.UPDATE_SERVER_ROLE_SUCCESS,
  payload: {
    serverId,
    data,
  },
});

export const updateOwnershipRequested = (serverId, userId) => ({
  type: C.UPDATE_SERVER_OWNERSHIP_REQUESTED,
  payload: {
    serverId,
    userId,
  },
});

export const updateOwnershipSuccess = (serverId, data) => ({
  type: C.UPDATE_SERVER_OWNERSHIP_SUCCESS,
  payload: {
    serverId,
    data,
  },
});

export const updateOwnershipFailed = (serverId, error) => ({
  type: C.UPDATE_SERVER_OWNERSHIP_FAILED,
  payload: {
    serverId,
    error,
  },
});

export const kickServerMemberRequested = (serverId, userId) => ({
  type: C.KICK_SERVER_MEMBER_REQUESTED,
  payload: {
    serverId,
    userId,
  },
});

export const kickServerMemberFailed = (serverId, error) => ({
  type: C.KICK_SERVER_MEMBER_FAILED,
  payload: {
    serverId,
    error,
  },
});

export const kickServerMemberSuccess = (serverId, userId, isLoggedInUser) => ({
  type: C.KICK_SERVER_MEMBER_SUCCESS,
  payload: {
    serverId,
    userId,
    isLoggedInUser,
  },
});

export const leaveServerMemberRequested = (serverId) => ({
  type: C.LEAVE_SERVER_MEMBER_REQUESTED,
  payload: {
    serverId,
  },
});

export const leaveServerMemberFailed = (serverId, error) => ({
  type: C.LEAVE_SERVER_MEMBER_FAILED,
  payload: {
    serverId,
    error,
  },
});

export const leaveServerMemberSuccess = (serverId, userId, isLoggedInUser) => ({
  type: C.LEAVE_SERVER_MEMBER_SUCCESS,
  payload: {
    serverId,
    userId,
    isLoggedInUser,
  },
});

export const deleteServerRequested = (serverId) => ({
  type: C.DELETE_SERVER_REQUESTED,
  payload: {
    serverId,
  },
});

export const deleteServerSuccess = (serverId) => ({
  type: C.DELETE_SERVER_SUCCESS,
  payload: {
    serverId,
  },
});

export const newServerMemberJoined = (serverId, newMember) => ({
  type: C.NEW_SERVER_MEMBER_JOINED_SUCCESS,
  payload: {
    serverId,
    newMember,
  },
});

// export const updateServerRoleFailed = (serverId, error) => ({
//   type: C.UPDATE_SERVER_ROLE_FAILED,
//   payload: {
//     serverId,
//     error,
//   },
// });
