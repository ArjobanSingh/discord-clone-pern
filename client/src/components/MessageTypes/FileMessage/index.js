/* eslint-disable jsx-a11y/media-has-caption */
import { memo } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import {
  Anchor,
  FileContainer, FileLoader, FileNameWrapper, FileTopContainer, MediaMessageContainer, StyledDownloadIcon,
} from '../commonMessageStyles';
import { FILE_ICON, PDF_ICON } from '../../../constants/images';
import StyledImage from '../../../common/StyledImage';
import { SimpleEllipsis } from '../../../common/StyledComponents';
import { MessageStatus } from '../../../constants/Message';
import { bytesToSize } from '../../../utils/helperFunctions';

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

  const isLoading = status === MessageStatus.SENT;

  return (
    <MediaMessageContainer>
      <FileContainer>
        <FileLoader />
        <FileTopContainer>
          <StyledImage
            src={fileMimeType === 'application/pdf' ? PDF_ICON : FILE_ICON}
            height="100%"
          />
          <FileNameWrapper>
            <Anchor href={fileUrl} rel="nonreferrer noopener" target="_blank">
              <SimpleEllipsis>
                {fileName}
              </SimpleEllipsis>
            </Anchor>
            <Typography
              color="text.secondaryDark"
              lineHeight="1"
              variant="caption"
            >
              {bytesToSize(fileSize)}
            </Typography>
          </FileNameWrapper>
          {isLoading && <StyledDownloadIcon onClick={downloadCurrentFile} />}
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
