import * as C from '../../constants/user';

export default (state = { isLoading: false, error: null, user: null }, action) => {
  switch (action.type) {
    case C.USER_REQUESTED:
      return { isLoading: true, error: null, user: null };
    case C.USER_FAILED:
      return { isLoading: false, error: action.payload.error, user: null };
    case C.USER_SUCCESS:
      return { isLoading: false, error: null, user: action.payload.user };
    default:
      return state;
  }
};
