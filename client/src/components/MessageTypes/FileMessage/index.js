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
import { FILE_ICON, PDF_ICON } from '../../../constants/images';
import StyledImage from '../../../common/StyledImage';
import { MessageStatus } from '../../../constants/Message';

const FileMessage = (props) => {
  const { message, downloadCurrentFile } = props;
  const {
    // blobUrl,
    fileUrl,
    fileName,
    fileSize,
    fileMimeType,
    status,
  } = message;

  const isLoading = status === MessageStatus.SENDING;
  const isFailed = status === MessageStatus.FAILED;
  const isSent = status === MessageStatus.SENT;

  return (
    <MediaMessageContainer>
      <FileContainer isFailed={isFailed}>
        {isLoading && <FileLoader />}
        <FileTopContainer>
          <StyledImage
            src={fileMimeType === 'application/pdf' ? PDF_ICON : FILE_ICON}
            height="100%"
          />
          <FileNameWrapper>
            {isFailed
              ? <ErrorFileUi fileName={fileName} />
              : <MainFileUi fileUrl={fileUrl} fileName={fileName} fileSize={fileSize} />}
          </FileNameWrapper>
          {isSent && <StyledDownloadIcon onClick={downloadCurrentFile} />}
        </FileTopContainer>
      </FileContainer>
    </MediaMessageContainer>
  );
};

FileMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fileSize: PropTypes.number.isRequired,
    fileMimeType: PropTypes.string.isRequired,
    blobUrl: PropTypes.string,
    fileUrl: PropTypes.string,
    fileName: PropTypes.string,
    status: PropTypes.oneOf(Object.keys(MessageStatus)).isRequired,
  }).isRequired,
  downloadCurrentFile: PropTypes.func.isRequired,
};

export default memo(FileMessage);
