import PropTypes from 'prop-types';
import { useState } from 'react';
import { MediaContainer, MediaMessageContainer } from '../commonMessageStyles';
import { useMessageData } from '../../../providers/MessageProvider';
import Video from './styles';
import useDidUpdate from '../../../customHooks/useDidUpdate';
import useLazyLoad from '../../../customHooks/useLazyLoad';

const VideoMessage = (props) => {
  const { message } = props;
  const {
    id,
    fileDimensions,
    blobUrl,
    fileUrl,
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

  return (
    <MediaMessageContainer>
      <MediaContainer ref={setRef} width={width} height={height}>
        <Video
          controls
          src={isIntersecting && fileUrl}
          onCanPlay={() => {
            setIsVideoReady(true);
          }}
          position={showBlobVideo ? 'absolute' : ''}
          opacity={showBlobVideo ? '0' : '1'}
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
  }).isRequired,
};

export default VideoMessage;
