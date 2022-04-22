import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ImageContainer, ImageMessageContainer, StyledImage } from './styles';

const ImageMessage = (props) => {
  const { message } = props;
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const { fileUrl, blobUrl, fileDimensions } = message;
  const [width, height] = fileDimensions.split(' ');

  return (
    <ImageMessageContainer>
      <ImageContainer width={width} height={height}>
        <StyledImage
          // onLoad={() => {
          //   setIsImageLoaded(true);
          //   if (blobUrl) URL.revokeObjectURL(blobUrl);
          // }}
          src={fileUrl}
          alt="attachment"
          // position={isImageLoaded ? '' : 'absolute'}
          // opacity={isImageLoaded ? '' : '0'}
        />
        {/* {!isImageLoaded && blobUrl && (
        <StyledImage
          src={blobUrl}
          alt="attachment"
        />
        )} */}
      </ImageContainer>
    </ImageMessageContainer>
  );
};

ImageMessage.propTypes = {
  message: PropTypes.shape({
    fileUrl: PropTypes.string.isRequired,
    blobUrl: PropTypes.string,
    fileDimensions: PropTypes.string,
  }).isRequired,
};

export default ImageMessage;
