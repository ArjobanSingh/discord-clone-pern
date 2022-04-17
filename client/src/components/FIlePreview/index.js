import React from 'react';
import PropTypes from 'prop-types';
import { MessageType } from '../../constants/Message';
import {
  Column, Image, ImageWrapper, Wrapper,
} from './styles';
import { AUDIO_ICON, FILE_ICON, VIDEO_ICON } from '../../constants/images';

const FilePreview = ({ file, index, removeFile }) => {
  const { messageType, originalFile, url } = file;

  const getImgProps = () => {
    switch (file.messageType) {
      case MessageType.IMAGE:
        return { src: url };
      case MessageType.VIDEO:
        return { src: VIDEO_ICON, isStatic: true };
      case MessageType.AUDIO:
        return { src: AUDIO_ICON, isStatic: true };
      default: {
        return { src: FILE_ICON, isStatic: true };
      }
    }
  };
  return (
    <Wrapper onClick={() => { removeFile(index); }}>
      <Column minHeight="0">
        <ImageWrapper>
          <Image
            {...getImgProps()}
            alt={originalFile.name}
          />
        </ImageWrapper>
      </Column>
      <Column>
        {messageType}
      </Column>
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
