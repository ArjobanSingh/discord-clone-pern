import * as C from '../../constants/user';

export default (state = { isLoading: false, error: null, user: null }, action) => {
  switch (action.type) {
    case C.USER_REQUESTED:
      return { isLoading: true, error: null, user: null };
    case C.USER_FAILED:
      return { isLoading: false, error: action.payload.error, user: null };
    case C.USER_SUCCESS:
      return { isLoading: false, error: null, user: action.payload.user };
    case C.UPDATED_USER_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload.data,
        },
      };
    default:
      return state;
  }
};
