export const AuthApi = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh-token',
};

export const UserApi = {
  GET_CURRENT_USER: '/user',
};

export const ServerApi = {
  GET_SERVER: '/server',
  JOIN_SERVER: '/server/join-server',
};

export const InviteApi = {
  CREATE_INVITE_URL: '/invite',
  VERIFY_INVITE_URL: '/invite',
};
