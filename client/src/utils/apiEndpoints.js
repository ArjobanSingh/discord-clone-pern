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
  CREATE_SERVER: '/server/create-server',
  UPDATE_SERVER: '/server/update-server',
  DELETE_SERVER: '/server/delete-server',
  UPDATE_ROLE: '/server/update-roles',
  TRANSFER_OWNERSHIP: '/server/transfer-ownership',
  KICK_MEMBER: '/server/kick-user',
  LEAVE_SERVER: '/server/leave-server',
};

export const InviteApi = {
  CREATE_INVITE_URL: '/invite',
  VERIFY_INVITE_URL: '/invite',
};

export const ChannelApi = {
  SEND_CHANNEL_MESSAGE: '/channel/send-message',
  GET_CHANNEL_MESSAGES: '/channel',
};
