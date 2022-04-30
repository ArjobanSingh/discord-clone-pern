import { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { StyledImage } from './styles';
import { useMessageData } from '../../../providers/MessageProvider';
import useDidUpdate from '../../../customHooks/useDidUpdate';
import { transformCloudinaryUrl } from '../../../utils/helperFunctions';
import useLazyLoad from '../../../customHooks/useLazyLoad';
import { ImageVideoLoader, MediaContainer, MediaMessageContainer } from '../commonMessageStyles';
import { MessageStatus } from '../../../constants/Message';

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
    status,
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
  const isLoading = status === MessageStatus.SENDING;

  return (
    <MediaMessageContainer>
      <MediaContainer width={width} height={height} ref={setRef}>
        <ImageVideoLoader />
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
              filter={isLoading ? 'opacity(0.5)' : ''}
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
    status: PropTypes.oneOf(Object.values(MessageStatus)).isRequired,
  }).isRequired,
};

export default memo(ImageMessage);
