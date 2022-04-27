import PropTypes from 'prop-types';
import { useState } from 'react';
import { MediaContainer, MediaMessageContainer } from '../commonMessageStyles';
import { useMessageData } from '../../../providers/MessageProvider';
import Video from './styles';

const getPoster = (fileUrl) => {
  const lastIndexOfDot = fileUrl.lastIndexOf('.');
  const removedExtensions = fileUrl.slice(0, lastIndexOfDot);
  return `${removedExtensions}.jpg`;
};

const VideoMessage = (props) => {
  const { message } = props;
  const {
    id,
    fileDimensions,
    blobUrl,
    fileUrl,
  } = message;

  const [isLoadedData, setIsLoadedData] = useState(false);

  const { removeObjectUrl } = useMessageData();
  const [width, height] = fileDimensions.split(' ');

  const poster = fileUrl ? getPoster(fileUrl) : '';
  const showMainVideo = !blobUrl || isLoadedData;
  const showBlobVideo = !!blobUrl && !isLoadedData;

  return (
    <MediaMessageContainer>
      <MediaContainer width={width} height={height}>
        <Video
        //   poster={poster}
          controls
          src={fileUrl}
          onCanPlay={() => {
            setIsLoadedData(true);
          }}
          position={showMainVideo ? '' : 'absolute'}
          opacity={showMainVideo ? '' : '0'}
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
