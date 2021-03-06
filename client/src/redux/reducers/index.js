import { combineReducers } from 'redux';
import { AUTH_SIGN_OUT_SUCCESS } from '../../constants/auth';
import auth, * as fromAuth from './auth';
import user from './user';
import servers, * as fromServers from './servers';
import joinServers, * as fromJoinServer from './join-servers';
import exploreServers, * as fromExploreServers from './explore-servers';
import createServers, * as fromCreateServers from './create-servers';
import channels, * as fromChannels from './channels';
import channelsChat, * as fromChannelsChat from './channels-chat';
import notifications, * as fromNotifications from './notifications';
import navigate from './navigate';

const appReducer = combineReducers({
  auth,
  user,
  navigate,
  servers,
  joinServers,
  exploreServers,
  createServers,
  channels,
  channelsChat,
  notifications,
});

const rootReducer = (state, action) => {
  if (action.type === AUTH_SIGN_OUT_SUCCESS) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default rootReducer;

// root selectors
export const getJoinServerApi = (state, serverId) => (
  fromJoinServer.getJoinServerApi(state.joinServers, serverId)
);
export const getServerDetails = (state, serverId) => (
  fromServers.getServerDetails(state.servers, serverId)
);
export const getAllServers = (state) => fromServers.getAllServers(state.servers);
export const getUpdateServerData = (state, serverId) => (
  fromServers.getUpdateServerData(state.servers, serverId)
);

export const getLoginAuthState = (state) => fromAuth.getLoginAuthState(state.auth);
export const getRegisterAuthState = (state) => fromAuth.getRegisterAuthState(state.auth);
export const getIsAuthenticated = (state) => fromAuth.getIsAuthenticated(state.auth);

export const getUser = (state) => state.user;

export const getExploreServersList = (state) => (
  fromExploreServers.getExploreServersList(state.exploreServers)
);

export const getAllExploreServersData = (state) => (
  fromExploreServers.getAllExploreServersData(state.exploreServers)
);

export const getExploreServerData = (state, serverId) => (
  fromExploreServers.getExploreServerData(state.exploreServers, serverId)
);

export const getNavigationState = (state) => state.navigate;

export const getServerCreationData = (state) => (
  fromCreateServers.getServerCreationData(state.createServers)
);

export const getAllServerChannels = (state, serverId) => (
  fromChannels.getAllServerChannels(state.channels, serverId)
);

export const getChannelData = (state, serverId, channelId) => (
  fromChannels.getChannelData(state.channels, serverId, channelId)
);

export const getChannelMessagesData = (state, serverId, channelId) => (
  fromChannelsChat.getChannelMessagesData(state.channelsChat, serverId, channelId)
);

export const getServerNotificationsData = (state, serverId) => (
  fromNotifications.getServerNotificationsData(state.notifications, serverId)
);

export const getChannelNotifications = (state, serverId, channelId) => (
  fromNotifications.getChannelNotifications(state.notifications, serverId, channelId)
);
