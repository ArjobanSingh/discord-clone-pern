import React from 'react';
import PropTypes from 'prop-types';
import { ImageContainer, StyledImage } from './styles';

const ImageMessage = (props) => {
  const { message } = props;
  const { fileUrl } = message;
  return (
    <ImageContainer>
      <StyledImage
        src={fileUrl}
        alt="attachment"
      />
    </ImageContainer>
  );
};

ImageMessage.propTypes = {
  message: PropTypes.shape({
    fileUrl: PropTypes.string.isRequired,
  }).isRequired,
};

export default ImageMessage;
