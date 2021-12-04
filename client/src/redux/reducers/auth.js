import { combineReducers } from 'redux';
import * as C from '../../constants/auth';

const registerReducer = (state = { isLoading: false, error: null }, action) => {
  switch (action.type) {
    case C.AUTH_REGISTER_REQUESTED:
      return { isLoading: true, error: null };
    case C.AUTH_REGISTER_SUCCESS:
      return { isLoading: false, error: null };
    case C.AUTH_REGISTER_FAILED:
      return { isLoading: false, error: action.payload.error };
    default:
      return state;
  }
};

const loginReducer = (state = { isLoading: false, error: null }, action) => {
  switch (action.type) {
    case C.AUTH_SIGN_IN_REQUESTED:
      return { isLoading: true, error: null };
    case C.AUTH_SIGN_IN_SUCCESS:
      return { isLoading: false, error: null };
    case C.AUTH_SIGN_IN_FAILED:
      return { isLoading: false, error: action.payload.error };
    default:
      return state;
  }
};

const mainReducer = (state = { isAuthenticated: !!localStorage.getItem('access-token') }, action) => {
  switch (action.type) {
    case C.AUTH_SIGN_IN_SUCCESS:
    case C.AUTH_REGISTER_SUCCESS:
      return { isAuthenticated: true };
    default:
      return state;
  }
};

export default combineReducers({
  main: mainReducer,
  login: loginReducer,
  register: registerReducer,
});
