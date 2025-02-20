import * as C from '../../constants/servers';

const initialState = {
  isLoading: false,
  error: null,
  uniqueIdentifier: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case C.CREATE_SERVER_REQUESTED:
      return {
        isLoading: true,
        error: null,
        uniqueIdentifier: action.payload.uniqueIdentifier,
      };
    case C.CREATE_SERVER_FAILED:
      if (action.payload.uniqueIdentifier !== state.uniqueIdentifier) {
        return state;
      }
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
    case C.CREATE_SERVER_RESET:
      return initialState;
    default:
      return state;
  }
};

export const getServerCreationData = (state) => state;
