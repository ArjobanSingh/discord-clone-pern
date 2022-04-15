import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import CancelIcon from '@mui/icons-material/Cancel';
import ChatInputField, { ReplyInputContainer } from './styles';

const InputEditor = (props) => {
  const { prepareMessage, replyMessage, setReplyMessage } = props;
  const [value, setValue] = useState('');

  const inputRef = useRef();

  useEffect(() => {
    if (replyMessage.id) inputRef.current.focus();
  }, [replyMessage.id]);

  const onSubmit = () => {
    if (!value.trim()) return;
    prepareMessage(value);
    setValue('');
  };

  const handleValueChange = (e) => {
    setValue(e.target.value);
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
      <ChatInputField
        ref={inputRef}
        isReplying={!!replyMessage.id}
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
  replyMessage: PropTypes.shape({
    id: PropTypes.string,
    user: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
  setReplyMessage: PropTypes.func.isRequired,
};

export default InputEditor;
