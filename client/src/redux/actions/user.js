import * as C from '../../constants/user';

export const userRequested = () => ({
  type: C.USER_REQUESTED,
});

export const userSuccess = (user) => ({
  type: C.USER_SUCCESS,
  payload: {
    user,
  },
});

export const userFailed = (error) => ({
  type: C.USER_FAILED,
  payload: {
    error,
  },
});
