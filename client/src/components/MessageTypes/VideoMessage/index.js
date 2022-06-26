import PropTypes from 'prop-types';
import { memo, useMemo, useState } from 'react';
import {
  ImageVideoError,
  ImageVideoLoader,
  MediaContainer,
  MediaMessageContainer,
} from '../commonMessageStyles';
import { useMessageData } from '../../../providers/MessageProvider';
import Video from './styles';
import useLazyLoad from '../../../customHooks/useLazyLoad';
import { MessageStatus } from '../../../constants/Message';
import { calculateAspectRatioFit } from '../../../utils/helperFunctions';

const VideoMessage = (props) => {
  const { message } = props;
  const {
    id,
    fileDimensions,
    blobUrl,
    fileUrl,
    status,
  } = message;

  const { setRef, isIntersecting } = useLazyLoad();

  const [isVideoReady, setIsVideoReady] = useState(false);

  const { removeObjectUrl } = useMessageData();

  const { width, height } = useMemo(() => {
    const [srcWidth, srcHeight] = fileDimensions.split(' ');
    return calculateAspectRatioFit(srcWidth, srcHeight);
  }, [fileDimensions]);

  const showBlobVideo = blobUrl && !isVideoReady;
  const isLoading = status === MessageStatus.SENDING;
  const isFailed = status === MessageStatus.FAILED;

  const handleCanPlayVideo = () => {
    setIsVideoReady(true);
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      removeObjectUrl(id);
    }
  };

  const getStatusUi = () => {
    if (isLoading) return <ImageVideoLoader />;
    if (isFailed) return <ImageVideoError />;
    return null;
  };

  return (
    <MediaMessageContainer>
      <MediaContainer ref={setRef} width={width} height={height}>
        {getStatusUi()}
        <Video
          controls
          src={isIntersecting ? fileUrl : ''}
          onCanPlay={handleCanPlayVideo}
          position={showBlobVideo ? 'absolute' : ''}
          opacity={showBlobVideo ? '0' : '1'}
        />
        {showBlobVideo && (
        <Video
          controls
          src={blobUrl}
          filter={isLoading || isFailed ? 'opacity(0.5)' : ''}
        />
        )}
      </MediaContainer>
    </MediaMessageContainer>
  );
};

VideoMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fileDimensions: PropTypes.string.isRequired,
    blobUrl: PropTypes.string,
    fileUrl: PropTypes.string,
    status: PropTypes.oneOf(Object.values(MessageStatus)).isRequired,
  }).isRequired,
};

export default memo(VideoMessage);
