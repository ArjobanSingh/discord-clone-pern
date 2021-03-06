import {
  useCallback, useEffect, useReducer, useRef,
} from 'react';
import axiosInstance from '../utils/axiosConfig';
import { handleError } from '../utils/helperFunctions';

const API_REQUESTED = 'API_REQUESTED';
const API_FAILED = 'API_FAILED';
const API_SUCCESS = 'API_SUCCESS';

const initialState = { isLoading: false, error: null, data: null };

const reducer = (state, action) => {
  switch (action.type) {
    case API_REQUESTED:
      return { ...state, isLoading: true, error: null };
    case API_FAILED:
      return { ...state, isLoading: false, error: action.payload.error };
    case API_SUCCESS:
      return { isLoading: false, error: null, data: action.payload.data };
    default:
      return state;
  }
};

const useApi = (
  apiHandler,
  { isConditionMet = true, callbackParams = {} } = {},
) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const callbackParamsRef = useRef(callbackParams);
  const apiHandlerRef = useRef(apiHandler);

  useEffect(() => {
    apiHandlerRef.current = apiHandler;
    callbackParamsRef.current = callbackParams;
  }, [apiHandler, callbackParams]);

  // whenever apiHandler function will change, new api request will be made
  const hitApi = useCallback(async () => {
    try {
      dispatch({ type: API_REQUESTED });
      const reponse = await apiHandlerRef.current(axiosInstance, callbackParamsRef.current);
      dispatch({ type: API_SUCCESS, payload: { data: reponse } });
    } catch (err) {
      const sessionExpireError = handleError(err, (error) => {
        dispatch({ type: API_FAILED, payload: { error } });
      });
      if (sessionExpireError) dispatch(sessionExpireError);
    }
  }, []);

  useEffect(() => {
    if (!isConditionMet) return;
    hitApi();
  }, [isConditionMet, hitApi]);

  return [state, hitApi];
};

export default useApi;
