import React from 'react';
import PropTypes from 'prop-types';
import { nanoid } from 'nanoid';
import {
  ChatContainer, InputContainer, MessagesContainer,
} from './styles';
import InputEditor from '../InputEditor';
import { MessageStatus, MessageType } from '../../constants/Message';

// chat component should be independent of channel/server logic
// to support personal messages in future
const Chat = (props) => {
  const {
    sendMessage,
  } = props;

  const prepareMessage = (message, type = MessageType.TEXT) => {
    // nanoid will work as temporary id, till message is sent
    sendMessage({
      content: message,
      type,
      id: nanoid(),
      status: MessageStatus.SENDING,
    });
  };

  return (
    <ChatContainer>
      <MessagesContainer>
        messages will be here
      </MessagesContainer>
      <InputContainer>
        <InputEditor prepareMessage={prepareMessage} />
      </InputContainer>
    </ChatContainer>
  );
};

Chat.propTypes = {
  sendMessage: PropTypes.func.isRequired,
};

export default Chat;
