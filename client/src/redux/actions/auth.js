import * as C from '../../constants/auth';

export function signInRequested(credentials, fromLocation) {
  return {
    type: C.AUTH_SIGN_IN_REQUESTED,
    payload: {
      credentials,
      fromLocation,
    },
  };
}

export function signInSuccess() {
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

export function registrationRequested(credentials, fromLocation) {
  return {
    type: C.AUTH_REGISTER_REQUESTED,
    payload: {
      credentials,
      fromLocation,
    },
  };
}

export function registrationSuccess() {
  return {
    type: C.AUTH_REGISTER_SUCCESS,
  };
}

export function registrationFailed(error) {
  return {
    type: C.AUTH_REGISTER_FAILED,
    payload: {
      error,
    },
  };
}

export function logoutRequested() {
  return {
    type: C.AUTH_SIGN_OUT_REQUESTED,
  };
}

export function logoutSuccess() {
  return {
    type: C.AUTH_SIGN_OUT_SUCCESS,
  };
}
