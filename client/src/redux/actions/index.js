import { INTERNET_DISCONNECTED, INTERNET_RECONNECTED } from '../../constants';

export const internetReconnected = () => ({
  type: INTERNET_RECONNECTED,
});

export const internetDisconnected = () => ({
  type: INTERNET_DISCONNECTED,
});
