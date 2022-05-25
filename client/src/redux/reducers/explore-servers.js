import { combineReducers } from 'redux';
import * as C from '../../constants/servers';

const initialState = {
  data: null,
  error: null,
  isLoading: false,
  isLoadingMore: false,
  hasMore: true,
};

const publicServersList = (state = initialState, action) => {
  switch (action.type) {
    case C.EXPLORE_SERVERS_REQUESTED:
      return {
        ...state,
        // whenever we refetch all servers, just show saved latest 50 servers only
        // till new request is in progress, and remove all servers which are older than 50th server
        // as it will refetched again when needed
        data: state.data ? state.data.slice(0, 50) : state.data,
        error: null,
        isLoading: true,
        isLoadingMore: false,
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
        ...state,
        data: action.payload.data,
        error: null,
        isLoading: false,
        hasMore: action.payload.hasMore,
      };
    case C.EXPLORE_MORE_SERVERS_REQUESTED:
      return {
        ...state,
        isLoadingMore: true,
      };
    case C.EXPLORE_MORE_SERVERS_SUCCESS:
      return {
        ...state,
        hasMore: action.payload.hasMore,
        isLoadingMore: false,
        data: [...state.data, ...action.payload.data],
      };
    case C.EXPLORE_MORE_SERVERS_FAILED:
      return {
        ...state,
        isLoadingMore: false,
      };
    default:
      return state;
  }
};

const publicServersData = (state = {}, action) => {
  switch (action.type) {
    case C.ADD_EXPLORE_SERVER_DATA:
      return {
        [action.payload.data.id]: {
          ...action.payload.data,
          isFetchingData: false,
          error: null,
        },
      };
    case C.SERVER_DETAILS_REQUESTED: {
      if (!action.payload.isExploringServer) return state;
      return {
        [action.payload.serverId]: {
          ...state[action.payload.serverId],
          isFetchingData: true,
          error: null,
        },
      };
    }
    case C.SERVER_DETAILS_FAILED:
      if (!action.payload.isExploringServer) return state;
      return {
        [action.payload.serverId]: {
          ...state[action.payload.serverId],
          isFetchingData: false,
          error: action.payload.error,
        },
      };
    case C.SERVER_DETAILS_SUCCESS:
      if (!action.payload.isExploringServer) return state;
      return {
        [action.payload.data.id]: {
          ...action.payload.data,
          isFetchingData: false,
          error: null,
        },
      };
    case C.JOIN_SERVER_SUCCESS: {
      if (state[action.payload.serverId]) return {};
      return state;
    }
    case C.RESET_EXPLORE_SERVER:
      return {};
    default:
      return state;
  }
};

export default combineReducers({
  publicServersList,
  publicServersData,
});

export const getExploreServersList = (state) => state.publicServersList;
export const getAllExploreServersData = (state) => state.publicServersData;
export const getExploreServerData = (state, serverId) => state.publicServersData[serverId];
