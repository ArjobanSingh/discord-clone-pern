import { memo, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { DownloadIconWrapper, StyledImage } from './styles';
import { useMessageData } from '../../../providers/MessageProvider';
import useDidUpdate from '../../../customHooks/useDidUpdate';
import { calculateAspectRatioFit, transformCloudinaryUrl } from '../../../utils/helperFunctions';
import useLazyLoad from '../../../customHooks/useLazyLoad';
import {
  ErrorWrapper,
  ImageVideoError,
  ImageVideoLoader, MediaContainer, MediaMessageContainer, StyledDownloadIcon,
} from '../commonMessageStyles';
import { MessageStatus } from '../../../constants/Message';

const ImageMessage = (props) => {
  const { message, downloadCurrentFile, setOpenSelectedImage } = props;
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

  const { width, height } = useMemo(() => {
    const [srcWidth, srcHeight] = fileDimensions.split(' ');
    return calculateAspectRatioFit(srcWidth, srcHeight);
  }, [fileDimensions]);

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
  const isFailed = status === MessageStatus.FAILED;
  const isSent = status === MessageStatus.SENT;

  const openThisImageInModal = () => {
    if (isSent) setOpenSelectedImage({ fileUrl, fileDimensions });
  };

  const getStatusUi = () => {
    if (isLoading) return <ImageVideoLoader />;
    if (isFailed) return <ImageVideoError />;
    return (
      <DownloadIconWrapper onClick={downloadCurrentFile} aria-label="download picture">
        <StyledDownloadIcon />
      </DownloadIconWrapper>
    );
  };

  return (
    <MediaMessageContainer>
      <MediaContainer width={width} height={height} ref={setRef}>
        {getStatusUi()}
        <StyledImage
          onClick={openThisImageInModal}
          onLoad={onImageLoad}
          src={isIntersecting ? transformedUrl : ''}
          alt="attachment"
          position={isImageLoaded ? '' : 'absolute'}
          opacity={isImageLoaded ? '' : '0'}
          cursor={isSent ? 'pointer' : ''}
        />
        {!isImageLoaded && thumbnail ? (
          <>
            <StyledImage
              src={isIntersecting ? thumbnail : ''}
              alt="attachment thumbnail"
              filter={isLoading || isFailed ? 'opacity(0.5)' : ''}
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
  downloadCurrentFile: PropTypes.func.isRequired,
  setOpenSelectedImage: PropTypes.func.isRequired,
};

export default memo(ImageMessage);
