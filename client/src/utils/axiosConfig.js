/* eslint-disable no-param-reassign */
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/';

const getAuthTokens = () => {
  const accessToken = localStorage.getItem('access-token');
  const refreshToken = localStorage.getItem('refresh-token');
  return [accessToken, refreshToken];
};

const updateAccessToken = (newToken) => {
  localStorage.setItem('access-token', newToken);
};

const refreshTokenApi = async () => ({});

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  const [accessToken, refreshToken] = getAuthTokens();
  if (accessToken) {
    config.headers['access-token'] = accessToken;
  }

  if (refreshToken) {
    config.headers['refresh-token'] = refreshToken;
  }
  return config;
}, (error) => Promise.reject(error));

instance.interceptors.response.use((res) => res, async (err) => {
  const originalConfig = err.config;

  if (err.response) {
    if (err.response.status === 401) {
      if (originalConfig.retry) {
        // we have already retried the api to get refresh token
        // it also failed
        // TODO: so log, user out
      } else {
        // to prevent infinte refresh token api request,
        // in case this refresh token api also return 401
        originalConfig.retry = true;
        try {
          const res = await refreshTokenApi();
          console.log('response for refresh token', res);
          const { accessToken } = res.data;
          updateAccessToken(accessToken);
          instance.defaults.headers.common['access-token'] = accessToken;
          return instance(originalConfig);
        } catch (refreshError) {
          if (refreshError.response?.status === 401) {
          // handle logout
          }
          return Promise.reject(refreshError);
        }
      }
    }
  }
  return Promise.reject(err);
});

export default instance;
