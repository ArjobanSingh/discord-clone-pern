/* eslint-disable jsx-a11y/media-has-caption */
import { memo } from 'react';
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

// TODO: add custom audio player ui
const AudioMessage = (props) => {
  const { message, downloadCurrentFile } = props;
  const {
    blobUrl,
    fileUrl,
    fileName,
    fileSize,
    status,
  } = message;

  const isLoading = status === MessageStatus.SENDING;
  const isFailed = status === MessageStatus.FAILED;
  const isSent = status === MessageStatus.SENT;

  const getStatusUi = () => {
    if (isLoading) return <FileLoader />;
    if (isSent) return <StyledDownloadIcon onClick={downloadCurrentFile} />;
    return null;
  };

  return (
    <MediaMessageContainer>
      <FileContainer isFailed={isFailed}>
        {getStatusUi()}
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
