import PropTypes from 'prop-types';

export const MessageType = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  AUDIO: 'AUDIO',
  FILE: 'FILE',
};

export const MessageStatus = {
  SENDING: 'SENDING',
  SENT: 'SENT',
  FAILED: 'FAILED',
};

export const MessageUserPropType = {
  profilePicture: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
};

export const MAX_FILE_SIZE = 1024 * 1024 * 3; // 3mb in bytes
