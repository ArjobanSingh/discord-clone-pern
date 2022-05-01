import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { calculateAspectRatioFit, stopPropagation } from '../../utils/helperFunctions';
import StyledImage from '../../common/StyledImage';

const ModalImage = ({ fileUrl, fileDimensions }) => {
  const { width, height } = useMemo(() => {
    const [srcWidth, srcHeight] = fileDimensions.split(' ');
    return calculateAspectRatioFit(srcWidth, srcHeight, 825, 500);
  }, [fileDimensions]);

  return (
    <StyledImage
      width={`${width}px`}
      height={`${height}px`}
      objectFit="contain"
      src={fileUrl}
      onClick={stopPropagation}
    />
  );
};

ModalImage.propTypes = {
  fileUrl: PropTypes.string.isRequired,
  fileDimensions: PropTypes.string.isRequired,
};

export default ModalImage;
