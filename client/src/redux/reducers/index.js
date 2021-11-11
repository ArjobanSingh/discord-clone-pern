import { combineReducers } from 'redux';
import { AUTH_SIGN_OUT } from '../../constants/auth';
import auth from './auth';

const appReducer = combineReducers({
  auth,
});

const rootReducer = (state, action) => {
  if (action.type === AUTH_SIGN_OUT) {
    return appReducer(undefined, action);
  }
  return (state, action);
};

export default rootReducer;
