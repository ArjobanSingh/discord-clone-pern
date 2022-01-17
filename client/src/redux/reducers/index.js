import { combineReducers } from 'redux';
import { AUTH_SIGN_OUT_SUCCESS } from '../../constants/auth';
import auth, * as fromAuth from './auth';
import user from './user';
import servers, * as fromServers from './servers';
import joinServers, * as fromJoinServer from './join-servers';
import exploreServers from './explore-servers';

const appReducer = combineReducers({
  auth,
  user,
  servers,
  joinServers,
  exploreServers,
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

export const getLoginAuthState = (state) => fromAuth.getLoginAuthState(state.auth);
export const getRegisterAuthState = (state) => fromAuth.getRegisterAuthState(state.auth);
export const getIsAuthenticated = (state) => fromAuth.getIsAuthenticated(state.auth);

export const getUser = (state) => state.user;
