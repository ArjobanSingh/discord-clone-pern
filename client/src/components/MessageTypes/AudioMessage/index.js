/* eslint-disable jsx-a11y/media-has-caption */
import { memo } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import {
  Anchor,
  FileContainer, FileNameWrapper, FileTopContainer, MediaMessageContainer, StyledDownloadIcon,
} from '../commonMessageStyles';
import { AUDIO_ICON } from '../../../constants/images';
import StyledImage from '../../../common/StyledImage';
import { SimpleEllipsis } from '../../../common/StyledComponents';
import { MessageStatus } from '../../../constants/Message';
import { bytesToSize } from '../../../utils/helperFunctions';

// TODO: add custom audio player ui
const AudioMessage = (props) => {
  const { message, downloadCurrentFile } = props;
  const {
    blobUrl,
    fileUrl,
    fileName,
    fileSize,
  } = message;

  return (
    <MediaMessageContainer>
      <FileContainer>
        <FileTopContainer>
          <StyledImage
            src={AUDIO_ICON}
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
          <StyledDownloadIcon onClick={downloadCurrentFile} />
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
