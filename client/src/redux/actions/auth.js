import * as C from '../../constants/auth';

export function signInRequested(payload) {
  return {
    type: C.AUTH_SIGN_IN_REQUESTED,
    payload,
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

export function registrationRequested(payload) {
  return {
    type: C.AUTH_REGISTER_REQUESTED,
    payload,
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
