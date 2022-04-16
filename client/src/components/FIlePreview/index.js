import React from 'react';
import PropTypes from 'prop-types';
import { MessageType } from '../../constants/Message';
import { Image, ImageWrapper, Wrapper } from './styles';
import { AUDIO_ICON, FILE_ICON, VIDEO_ICON } from '../../constants/images';

const FilePreview = ({ file, index, removeFile }) => {
  const { messageType, originalFile, url } = file;

  const getSrc = () => {
    switch (file.messageType) {
      case MessageType.IMAGE:
        return url;
      case MessageType.VIDEO:
        return VIDEO_ICON;
      case MessageType.AUDIO:
        return AUDIO_ICON;
      default: {
        return FILE_ICON;
      }
    }
  };
  return (
    <Wrapper onClick={() => { removeFile(index); }}>
      <ImageWrapper>
        <Image
          src={getSrc()}
          alt={originalFile.name}
        />
      </ImageWrapper>
      {messageType}
    </Wrapper>
  );
};

FilePreview.propTypes = {
  file: PropTypes.shape({
    messageType: PropTypes.oneOf(Object.keys(MessageType)).isRequired,
    url: PropTypes.string.isRequired,
    originalFile: PropTypes.shape({
      name: PropTypes.string,
    }).isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  removeFile: PropTypes.func.isRequired,
};

export default FilePreview;
