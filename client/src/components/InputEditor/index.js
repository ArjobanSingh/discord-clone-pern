import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import SendIcon from '@mui/icons-material/Send';
import { toast } from 'react-toastify';
import debounce from 'lodash.debounce';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { nanoid } from 'nanoid';
import Button from '@mui/material/Button';
import ChatInputField, {
  FileInput,
  FilesContainer,
  ReplyInputContainer,
  SendButtonWrapper,
  TextWrapper,
  UploadIconWrapper,
} from './styles';
import { MAX_FILE_SIZE } from '../../constants/Message';
import { getMessageType } from '../../utils/helperFunctions';
import { isEmpty } from '../../utils/validators';
import FilePreview from '../FIlePreview';

const InputEditor = (props) => {
  const {
    prepareMessage,
    replyMessage,
    setReplyMessage,
    files,
    setFiles,
  } = props;
  const [value, setValue] = useState('');
  const [currentFileIndex, setCurrentFileIndex] = useState();

  const inputRef = useRef();
  const isValidForSubmit = !isEmpty(files) || !!value.trim();

  useEffect(() => {
    if (replyMessage.id) inputRef.current.focus();
  }, [replyMessage.id]);

  const onSubmit = () => {
    if (!isValidForSubmit) return;
    prepareMessage(value);
    setValue('');
  };

  const updateCaption = useCallback(debounce((caption, index) => {
    setFiles((prevFiles) => prevFiles.map((file, idx) => (
      idx === index ? { ...file, caption } : file
    )));
  }, 200), []);

  const handleValueChange = (e) => {
    const { value: newValue } = e.target;
    setValue(newValue);

    // if sending files and some files selected, updateCaption
    if (currentFileIndex !== undefined) updateCaption(newValue, currentFileIndex);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && replyMessage.id) {
      setReplyMessage({});
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const closeReply = (e) => {
    e.stopPropagation();
    setReplyMessage({});
  };

  const scrollToElement = () => {
    const element = document.getElementById(replyMessage.id);
    if (!element) return;
    element.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
  };

  const handleFileInput = (e) => {
    const selectedFiles = e.target.files || e.nativeEvent?.target?.files;
    if (!selectedFiles) {
      toast.error('Some error occurred, Please try again');
      return;
    }
    const validFiles = [];
    const isAnyInvalid = [...selectedFiles].some((file) => {
      const {
        size,
        type: contentType,
      } = file;
      if (size > MAX_FILE_SIZE) return true;
      const messageType = getMessageType(file);
      const objectUrl = URL.createObjectURL(file);
      validFiles.push({
        originalFile: file,
        url: objectUrl,
        messageType,
        contentType,
        caption: '',
        id: nanoid(),
      });
      return false;
    });

    if (isAnyInvalid) {
      toast.error('Max file size is 3mb');
      return;
    }
    setCurrentFileIndex((prev) => prev ?? 0);
    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    inputRef.current.focus();
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== index));
  };
  const selectFile = (index) => {
    const nextSelectedFile = index !== undefined
      ? files[index]
      : undefined;

    setCurrentFileIndex(index);
    setValue(nextSelectedFile?.caption ?? '');
  };

  // new pattern learnt from React beta docs, to update while rendering
  // instead of using useEffects, TO read more about this go to url
  // https://beta.reactjs.org/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (currentFileIndex !== undefined && currentFileIndex >= files.length) {
    if (files.length === 0) {
      setCurrentFileIndex(undefined);
    } else setCurrentFileIndex(files.length - 1);
    return null;
  }

  return (
    <>
      {!!replyMessage.id && (
        <ReplyInputContainer onClick={scrollToElement}>
          <div>
            Replying to
            {' '}
            <span>{replyMessage.user.name}</span>
          </div>
          <CancelIcon onClick={closeReply} />
        </ReplyInputContainer>
      )}
      {!isEmpty(files) && (
        <FilesContainer>
          {files.map((file, index) => (
            <FilePreview
              removeFile={removeFile}
              selectFile={selectFile}
              selectedIndex={currentFileIndex}
              index={index}
              key={file.id}
              file={file}
            />
          ))}
        </FilesContainer>
      )}
      <TextWrapper hideTopRadius={!!replyMessage.id || !isEmpty(files)}>
        <UploadIconWrapper>
          <AddCircleIcon />
          <FileInput type="file" onChange={handleFileInput} multiple />
        </UploadIconWrapper>
        <ChatInputField
          isReply={!!replyMessage.id}
          isFiles={!isEmpty(files)}
          ref={inputRef}
          onKeyDown={handleKeyDown}
          onChange={handleValueChange}
          value={value}
          placeholder={isEmpty(files) ? 'Send Message' : 'Add Caption to selected file'}
        />
        {isValidForSubmit && (
          <SendButtonWrapper>
            <Button
              variant="contained"
              size="small"
              endIcon={<SendIcon fontSize="inherit" />}
              onClick={onSubmit}
            >
              Send
            </Button>
          </SendButtonWrapper>
        )}
      </TextWrapper>
    </>
  );
};

InputEditor.propTypes = {
  prepareMessage: PropTypes.func.isRequired,
  replyMessage: PropTypes.shape({
    id: PropTypes.string,
    user: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
  setReplyMessage: PropTypes.func.isRequired,
  files: PropTypes.arrayOf(PropTypes.object).isRequired,
  setFiles: PropTypes.func.isRequired,
};

export default InputEditor;
