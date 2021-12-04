import { SET_USER } from '../../constants/user';

export default (state = {}, action) => {
  switch (action.type) {
    case SET_USER:
      return action.payload;
    default:
      return state;
  }
};
