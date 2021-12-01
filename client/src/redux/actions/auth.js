import * as C from '../../constants/auth';

export function signInRequested(payload) {
  return {
    type: C.AUTH_SIGN_IN_REQUESTED,
    payload,
  };
}

export function signInSuccess() {
  // maybe some paylaod in future, like user details
  return {
    type: C.AUTH_SIGN_IN_SUCCESS,
  };
}

export function signInFailed(error) {
  return {
    type: C.AUTH_SIGN_IN_FAILED,
    payload: {
      error,
    },
  };
}
