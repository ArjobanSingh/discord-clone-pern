import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import CancelIcon from '@mui/icons-material/Cancel';
import ChatInputField, { ReplyInputContainer } from './styles';

const InputEditor = (props) => {
  const { prepareMessage, replyMessage, setReplyMessage } = props;
  const [value, setValue] = useState('');

  const inputRef = useRef();

  useEffect(() => {
    if (replyMessage.messageId) inputRef.current.focus();
  }, [replyMessage.messageId]);

  const onSubmit = () => {
    if (!value.trim()) return;
    prepareMessage(value);
    setValue('');
  };

  const handleValueChange = (e) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && replyMessage.messageId) {
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
    const element = document.getElementById(replyMessage.messageId);
    if (!element) return;
    element.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
  };

  return (
    <>
      {!!replyMessage.messageId && (
        <ReplyInputContainer onClick={scrollToElement}>
          <div>
            Replying to
            {' '}
            <span>{replyMessage.userName}</span>
          </div>
          <CancelIcon onClick={closeReply} />
        </ReplyInputContainer>
      )}
      <ChatInputField
        ref={inputRef}
        isReplying={!!replyMessage.messageId}
        onKeyDown={handleKeyDown}
        onChange={handleValueChange}
        value={value}
        placeholder="Send Message"
      />
    </>
  );
};

InputEditor.propTypes = {
  prepareMessage: PropTypes.func.isRequired,
  replyMessage: PropTypes.objectOf(PropTypes.string).isRequired,
  setReplyMessage: PropTypes.func.isRequired,
};

export default InputEditor;
