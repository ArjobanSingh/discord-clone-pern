import { combineReducers } from 'redux';
import { AUTH_SIGN_OUT_SUCCESS } from '../../constants/auth';
import auth from './auth';
import user from './user';

const appReducer = combineReducers({
  auth,
  user,
});

const rootReducer = (state, action) => {
  if (action.type === AUTH_SIGN_OUT_SUCCESS) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
