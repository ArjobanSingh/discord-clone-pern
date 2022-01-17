import * as C from '../../constants/servers';

// TODO: load more servers
export default (state = { data: null, error: null, isLoading: false }, action) => {
  switch (action.type) {
    case C.EXPLORE_SERVERS_REQUESTED:
      return {
        // whenever we refetch all servers, just show saved latest 50 servers only
        // till new request is in progress, and remove all servers which are older than 50th server
        // as it will refetched again when needed
        data: state.data ? state.data.slice(0, 50) : state.data,
        error: null,
        isLoading: true,
      };
    case C.EXPLORE_SERVERS_FAILED:
      return {
        ...state,
        // if data already fetched, do not show error as ui will render saved servers
        error: state.data ? null : action.payload.error,
        isLoading: false,
      };
    case C.EXPLORE_SERVERS_SUCCESS:
      return {
        data: action.payload.data,
        error: null,
        isLoading: false,
      };
    default:
      return state;
  }
};
