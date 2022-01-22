import * as C from '../../constants/navigate';

export const setNavigateState = (data) => ({
  type: C.SET_NAVIGATE_STATE,
  payload: { data },
});

export const resetNavigationState = () => ({
  type: C.RESET_NAVIGATE_STATE,
});
