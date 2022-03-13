import PropTypes from 'prop-types';
import { nanoid } from 'nanoid';
import {
  ChatContainer, InputContainer, MessagesContainer,
} from './styles';
import InputEditor from '../InputEditor';
import { MessageStatus, MessageType } from '../../constants/Message';
import { isEmpty } from '../../utils/validators';
import Messages from '../Messages';

// chat component should be independent of channel/server logic
// to support personal messages in future
const Chat = (props) => {
  const {
    sendMessage,
    messagesData,
  } = props;

  const {
    data,
    isLoading,
    error,
  } = messagesData;

  const prepareMessage = (message, type = MessageType.TEXT) => {
    // nanoid will work as temporary id, till message is sent
    sendMessage({
      content: message,
      type,
      id: nanoid(),
      status: MessageStatus.SENDING,
    });
  };

  const mainJSX = () => {
    if (isLoading) return <div>Fetching messages...</div>;
    if (error) return <div>Error fetching messages...Retry</div>; // TODO
    if (isEmpty(data)) return <div>No messages in this channel yet</div>;
    return <Messages messages={data} />;
  };

  return (
    <ChatContainer>
      <MessagesContainer>
        {mainJSX()}
      </MessagesContainer>
      <InputContainer>
        <InputEditor prepareMessage={prepareMessage} />
      </InputContainer>
    </ChatContainer>
  );
};

Chat.propTypes = {
  sendMessage: PropTypes.func.isRequired,
  messagesData: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.object),
    hasMore: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    error: PropTypes.shape({}),
  }).isRequired,
};

export default Chat;
