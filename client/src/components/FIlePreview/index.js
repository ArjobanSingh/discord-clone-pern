import PropTypes from 'prop-types';
import DeleteIcon from '@mui/icons-material/Delete';
import { MessageType } from '../../constants/Message';
import {
  Column, Image, ImageWrapper, Wrapper,
} from './styles';
import { AUDIO_ICON, FILE_ICON, VIDEO_ICON } from '../../constants/images';
import { OptionsContainer } from '../Message/styles';

const FilePreview = ({
  file, index, removeFile, selectFile, selectedIndex,
}) => {
  const { messageType, originalFile, url } = file;

  const getImgProps = () => {
    switch (file.messageType) {
      case MessageType.IMAGE:
        return { src: url };
      case MessageType.VIDEO:
        return { src: VIDEO_ICON, isStatic: true };
      case MessageType.AUDIO:
        return { src: AUDIO_ICON, isStatic: true };
      default: {
        return { src: FILE_ICON, isStatic: true };
      }
    }
  };

  const removeHandler = (e) => {
    e.stopPropagation();
    removeFile(index);
  };

  const selectHandler = () => {
    selectFile(index);
  };

  return (
    <Wrapper onClick={selectHandler} isSelected={selectedIndex === index}>
      <OptionsContainer display="block" right="-10px">
        <div>
          <DeleteIcon onClick={removeHandler} />
        </div>
      </OptionsContainer>
      <Column minHeight="0">
        <ImageWrapper>
          <Image
            {...getImgProps()}
            alt={originalFile.name}
          />
        </ImageWrapper>
      </Column>
      <Column>
        {messageType}
      </Column>
    </Wrapper>
  );
};

FilePreview.propTypes = {
  file: PropTypes.shape({
    messageType: PropTypes.oneOf(Object.keys(MessageType)).isRequired,
    url: PropTypes.string.isRequired,
    originalFile: PropTypes.shape({
      name: PropTypes.string,
    }).isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  removeFile: PropTypes.func.isRequired,
  selectFile: PropTypes.func.isRequired,
  selectedIndex: PropTypes.number,
};

FilePreview.defaultProps = {
  selectedIndex: null,
};

export default FilePreview;
