import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import { ImageVideoLoader, MediaContainer, MediaMessageContainer } from '../commonMessageStyles';
import { useMessageData } from '../../../providers/MessageProvider';
import Video from './styles';
import useDidUpdate from '../../../customHooks/useDidUpdate';
import useLazyLoad from '../../../customHooks/useLazyLoad';
import { MessageStatus } from '../../../constants/Message';

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
  const [width, height] = fileDimensions.split(' ');

  useDidUpdate(() => {
    if (isVideoReady && blobUrl) {
      URL.revokeObjectURL(blobUrl);
      removeObjectUrl(id);
    }
  }, [isVideoReady, blobUrl, id, removeObjectUrl]);

  const showBlobVideo = blobUrl && !isVideoReady;
  const isLoading = status === MessageStatus.SENDING;

  return (
    <MediaMessageContainer>
      <MediaContainer ref={setRef} width={width} height={height}>
        {isLoading && <ImageVideoLoader />}
        <Video
          controls
          src={isIntersecting ? fileUrl : ''}
          onCanPlay={() => {
            setIsVideoReady(true);
          }}
          position={showBlobVideo ? 'absolute' : ''}
          opacity={showBlobVideo ? '0' : '1'}
          filter={isLoading ? 'opacity(0.5)' : ''}
        />
        {showBlobVideo && <Video controls src={blobUrl} />}
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
