import * as C from '../../constants/navigate';

export default (state = null, action) => {
  switch (action.type) {
    case C.SET_NAVIGATE_STATE:
      return action.payload.data;
    case C.RESET_NAVIGATE_STATE:
      return null;
    default:
      return state;
  }
};
