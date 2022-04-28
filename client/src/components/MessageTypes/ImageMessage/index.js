import { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { StyledImage } from './styles';
import { useMessageData } from '../../../providers/MessageProvider';
import useDidUpdate from '../../../customHooks/useDidUpdate';
import { transformCloudinaryUrl } from '../../../utils/helperFunctions';
import useLazyLoad from '../../../customHooks/useLazyLoad';
import { MediaContainer, MediaMessageContainer } from '../commonMessageStyles';

const ImageMessage = (props) => {
  const { message } = props;
  const { removeObjectUrl } = useMessageData();

  const {
    id,
    fileUrl,
    fileMimeType,
    blobUrl,
    fileDimensions,
    fileThumbnail,
  } = message;

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const { setRef, isIntersecting } = useLazyLoad();

  let thumbnail = blobUrl;
  if (!thumbnail) thumbnail = fileThumbnail ? `data:${fileMimeType};base64,${fileThumbnail}` : '';

  const [width, height] = fileDimensions.split(' ');

  useDidUpdate(() => {
    if (isImageLoaded && blobUrl) {
      URL.revokeObjectURL(blobUrl);
      removeObjectUrl(id);
    }
  }, [isImageLoaded, blobUrl, id, removeObjectUrl]);

  const onImageLoad = () => {
    setIsImageLoaded(true);
  };

  // did not used react-cloudinary because:
  // 1) Intially, it was loading image two times with different urls when applied transformations
  // 2) just needed this simple transformations, so can avoid installing that
  const transformedUrl = transformCloudinaryUrl(fileUrl, width, height);

  return (
    <MediaMessageContainer>
      <MediaContainer width={width} height={height} ref={setRef}>
        <StyledImage
          onLoad={onImageLoad}
          src={isIntersecting ? transformedUrl : ''}
          alt="attachment"
          position={isImageLoaded ? '' : 'absolute'}
          opacity={isImageLoaded ? '' : '0'}
        />
        {!isImageLoaded && thumbnail ? (
          <>
            <StyledImage
              src={isIntersecting ? thumbnail : ''}
              alt="attachment thumbnail"
            />
          </>
        ) : null}
      </MediaContainer>
    </MediaMessageContainer>
  );
};

ImageMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fileUrl: PropTypes.string,
    fileMimeType: PropTypes.string.isRequired,
    blobUrl: PropTypes.string,
    fileDimensions: PropTypes.string,
    fileThumbnail: PropTypes.string,
  }).isRequired,
};

export default memo(ImageMessage);
