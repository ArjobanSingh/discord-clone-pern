/* eslint-disable no-param-reassign */
import axios from 'axios';
import { AuthApi } from './apiEndpoints';

const isProduction = process.env.NODE_ENV === 'production';

const BASE_URL = isProduction ? '/api' : 'http://localhost:5000/api';
export const APP_URL = window.location.origin; // 'http://localhost:3000';

export const getAuthTokens = () => {
  const accessToken = localStorage.getItem('access-token');
  const refreshToken = localStorage.getItem('refresh-token');
  return [accessToken, refreshToken];
};

const updateAccessToken = (accessToken) => {
  localStorage.setItem('access-token', `Bearer ${accessToken}`);
};

export const setTokens = (accessToken, refreshToken) => {
  updateAccessToken(accessToken);
  localStorage.setItem('refresh-token', refreshToken);
};

export const removeTokens = () => {
  localStorage.removeItem('access-token');
  localStorage.removeItem('refresh-token');
};

const ignoreUrlsForRefreshToken = ['/auth/login', '/auth/logout', '/auth/refresh-token'];

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  const [accessToken, refreshToken] = getAuthTokens();
  if (accessToken) config.headers['access-token'] = accessToken;
  if (refreshToken) config.headers['refresh-token'] = refreshToken;

  return config;
}, (error) => Promise.reject(error));

instance.interceptors.response.use((res) => res, async (err) => {
  const originalConfig = err.config;

  if (!ignoreUrlsForRefreshToken.includes(originalConfig.url) && err.response) {
    if (err.response.status === 401 || err.status === 401) {
      // To prevent infinite api fetch, in case backend api is returning 401 continuously
      if (!originalConfig.retry) {
        // No need to wrap with try/catch, as error in this case will be handled by
        // reponse error handler
        originalConfig.retry = true;
        const res = await instance.post(AuthApi.REFRESH);
        const { accessToken } = res.data;
        updateAccessToken(accessToken);
        instance.defaults.headers.common['access-token'] = accessToken;
        return instance(originalConfig);
      }
    }
  }

  if ((err.response?.status === 401 || err.status === 401)) removeTokens();

  // in case api continuously responds with 401 or ignoredUrl's respond with 401
  // or any other error case should should be rejected from here to be handled in sagas
  return Promise.reject(err);
});

export default instance;
