export const SAVE_ALL_SERVERS_LIST = 'SAVE_ALL_SERVERS_LIST';

export const SERVER_DETAILS_REQUESTED = 'SERVER_DETAILS_REQUESTED';
export const SERVER_DETAILS_FAILED = 'SERVER_DETAILS_FAILED';
export const SERVER_DETAILS_SUCCESS = 'SERVER_DETAILS_SUCCESS';

export const JOIN_SERVER_REQUESTED = 'JOIN_SERVER_REQUESTED';
export const JOIN_SERVER_FAILED = 'JOIN_SERVER_FAILED';
export const JOIN_SERVER_SUCCESS = 'JOIN_SERVER_SUCCESS';

export const REMOVE_SERVER = 'REMOVE_SERVER';
export const SAVE_INVITE_URL = 'SAVE_INVITE_URL';

export const ServerTypes = {
  PRIVATE: 'private',
  PUBLIC: 'public',
};

export const ServerMemberRoles = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR',
  USER: 'USER',
};

export const ServerMemberScores = {
  [ServerMemberRoles.USER]: 0,
  [ServerMemberRoles.MODERATOR]: 1,
  [ServerMemberRoles.ADMIN]: 2,
  [ServerMemberRoles.OWNER]: 3,
};

export const serverValidation = {
  SERVER_NAME_MIN_LENGTH: 3,
  SERVER_NAME_MAX_LENGTH: 120,
  SERVER_DESCRIPTION_MAX_LENGTH: 2000,
};

export const EXPLORE_SERVERS_REQUESTED = 'EXPLORE_SERVERS_REQUESTED';
export const EXPLORE_SERVERS_FAILED = 'EXPLORE_SERVERS_FAILED';
export const EXPLORE_SERVERS_SUCCESS = 'EXPLORE_SERVERS_SUCCESS';
export const EXPLORE_MORE_SERVERS_REQUESTED = 'EXPLORE_MORE_SERVERS_REQUESTED';
export const EXPLORE_MORE_SERVERS_FAILED = 'EXPLORE_MORE_SERVERS_FAILED';
export const EXPLORE_MORE_SERVERS_SUCCESS = 'EXPLORE_MORE_SERVERS_SUCCESS';

export const ADD_EXPLORE_SERVER_DATA = 'ADD_EXPLORE_SERVER_DATA';
export const RESET_EXPLORE_SERVER = 'RESET_EXPLORE_SERVER';

export const CREATE_SERVER_REQUESTED = 'CREATE_SERVER_REQUESTED';
export const CREATE_SERVER_FAILED = 'CREATE_SERVER_FAILED';
export const CREATE_SERVER_SUCCESS = 'CREATE_SERVER_SUCCESS';
export const CREATE_SERVER_RESET = 'CREATE_SERVER_RESET';

export const UPDATE_SERVER_REQUESTED = 'UPDATE_SERVER_REQUESTED';
export const UPDATE_SERVER_FAILED = 'UPDATE_SERVER_FAILED';
export const UPDATE_SERVER_SUCCESS = 'UPDATE_SERVER_SUCCESS';

export const SERVER_SETTINGS = {
  OVERVIEW: 'Overview',
  MEMBERS: 'Members',
  BANS: 'Bans',
  DELETE_SERVER: 'Delete Server',
};

export const UPDATE_SERVER_ROLE_REQUESTED = 'UPDATE_SERVER_ROLE_REQUESTED';
export const UPDATE_SERVER_ROLE_SUCCESS = 'UPDATE_SERVER_ROLE_SUCCESS';
export const UPDATE_SERVER_ROLE_FAILED = 'UPDATE_SERVER_ROLE_FAILED';

export const UPDATE_SERVER_OWNERSHIP_REQUESTED = 'UPDATE_SERVER_OWNERSHIP_REQUESTED';
export const UPDATE_SERVER_OWNERSHIP_SUCCESS = 'UPDATE_SERVER_OWNERSHIP_SUCCESS';
export const UPDATE_SERVER_OWNERSHIP_FAILED = 'UPDATE_SERVER_OWNERSHIP_FAILED';

export const KICK_SERVER_MEMBER_REQUESTED = 'KICK_SERVER_MEMBER_REQUESTED';
export const KICK_SERVER_MEMBER_FAILED = 'KICK_SERVER_MEMBER_FAILED';
export const KICK_SERVER_MEMBER_SUCCESS = 'KICK_SERVER_MEMBER_SUCCESS';

export const LEAVE_SERVER_MEMBER_REQUESTED = 'LEAVE_SERVER_MEMBER_REQUESTED';
export const LEAVE_SERVER_MEMBER_FAILED = 'LEAVE_SERVER_MEMBER_FAILED';
export const LEAVE_SERVER_MEMBER_SUCCESS = 'LEAVE_SERVER_MEMBER_SUCCESS';

export const DELETE_SERVER_REQUESTED = 'DELETE_SERVER_REQUESTED';
export const DELETE_SERVER_FAILED = 'DELETE_SERVER_FAILED';
export const DELETE_SERVER_SUCCESS = 'DELETE_SERVER_SUCCESS';

export const NEW_SERVER_MEMBER_JOINED_SUCCESS = 'NEW_SERVER_MEMBER_JOINED_SUCCESS';

export const REMOVE_PRIVATE_SERVER_FROM_EXPLORE = 'REMOVE_PRIVATE_SERVER_FROM_EXPLORE';
