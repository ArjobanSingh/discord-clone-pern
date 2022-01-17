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
    case C.AUTH_SIGN_OUT_SUCCESS:
      return { isAuthenticated: false };
    default:
      return state;
  }
};

export default combineReducers({
  main: mainReducer,
  login: loginReducer,
  register: registerReducer,
});

export const getLoginAuthState = (state) => state.login;
export const getRegisterAuthState = (state) => state.register;
export const getIsAuthenticated = (state) => state.main.isAuthenticated;
