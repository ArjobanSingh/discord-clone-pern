import * as C from '../../constants/servers';

const initialState = {
  isLoading: false,
  error: null,
  uniqueIndentifier: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case C.CREATE_SERVER_REQUESTED:
      return {
        isLoading: true,
        error: null,
        uniqueIndentifier: action.payload.uniqueIndentifier,
      };
    case C.CREATE_SERVER_FAILED:
      if (action.payload.uniqueIndentifier !== state.uniqueIndentifier) return state;
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
};
