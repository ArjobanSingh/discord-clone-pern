import { AUTH_SIGN_IN_FAILED, AUTH_SIGN_IN_REQUESTED, AUTH_SIGN_IN_SUCCESS } from '../../constants/auth';

const initialState = {
  isAuthenticated: !!localStorage.getItem('access-token'),
  isLoading: false,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTH_SIGN_IN_REQUESTED:
      return { ...initialState, isLoading: true, error: null };
    case AUTH_SIGN_IN_SUCCESS:
      return { isAuthenticated: true, isLoading: false, error: null };
    case AUTH_SIGN_IN_FAILED:
      return { isAuthenticated: false, isLoading: false, error: action.payload.error };
    default:
      return state;
  }
};
