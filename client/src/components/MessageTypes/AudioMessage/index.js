/* eslint-disable jsx-a11y/media-has-caption */
import { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  ErrorFileUi,
  FileContainer,
  FileLoader,
  FileNameWrapper,
  FileTopContainer,
  MainFileUi,
  MediaMessageContainer,
  StyledDownloadIcon,
} from '../commonMessageStyles';
import { AUDIO_ICON } from '../../../constants/images';
import StyledImage from '../../../common/StyledImage';
import { MessageStatus } from '../../../constants/Message';
import { useMessageData } from '../../../providers/MessageProvider';

// TODO: add custom audio player ui and revoke blob url on main audio loadedData
const AudioMessage = (props) => {
  const { message, downloadCurrentFile } = props;
  const { removeObjectUrl } = useMessageData();

  const {
    id,
    blobUrl,
    fileUrl,
    fileName,
    fileSize,
    status,
  } = message;

  const isLoading = status === MessageStatus.SENDING;
  const isFailed = status === MessageStatus.FAILED;
  const isSent = status === MessageStatus.SENT;

  useEffect(() => {
    if (isSent && blobUrl) {
      URL.revokeObjectURL(blobUrl);
      removeObjectUrl(id);
    }
  }, [isSent, blobUrl]);

  return (
    <MediaMessageContainer>
      <FileContainer isFailed={isFailed}>
        {isLoading && <FileLoader />}
        <FileTopContainer>
          <StyledImage
            src={AUDIO_ICON}
            height="100%"
          />
          <FileNameWrapper>
            {isFailed
              ? <ErrorFileUi fileName={fileName} />
              : <MainFileUi fileUrl={fileUrl} fileName={fileName} fileSize={fileSize} />}
          </FileNameWrapper>
          {isSent && <StyledDownloadIcon onClick={downloadCurrentFile} />}
        </FileTopContainer>
        <audio controls src={fileUrl ?? blobUrl} />
      </FileContainer>
    </MediaMessageContainer>
  );
};

AudioMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fileSize: PropTypes.number.isRequired,
    blobUrl: PropTypes.string,
    fileUrl: PropTypes.string,
    fileName: PropTypes.string,
    status: PropTypes.oneOf(Object.keys(MessageStatus)).isRequired,
  }).isRequired,
  downloadCurrentFile: PropTypes.func.isRequired,
};

export default memo(AudioMessage);
