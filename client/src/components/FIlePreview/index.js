import React from 'react';
import PropTypes from 'prop-types';
import { MessageType } from '../../constants/Message';

const FilePreview = ({ file }) => {
  const { messageType } = file;
  return (
    <div>
      {messageType}
    </div>
  );
};

FilePreview.propTypes = {
  file: PropTypes.shape({
    messageType: PropTypes.oneOf(Object.keys(MessageType)).isRequired,
  }).isRequired,
};

export default FilePreview;
