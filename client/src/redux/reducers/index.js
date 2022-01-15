import { combineReducers } from 'redux';
import { AUTH_SIGN_OUT_SUCCESS } from '../../constants/auth';
import auth from './auth';
import user from './user';
import servers, * as fromServers from './servers';
import joinServers, * as fromJoinServer from '../../constants/join-servers';

const appReducer = combineReducers({
  auth,
  user,
  servers,
  joinServers,
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
