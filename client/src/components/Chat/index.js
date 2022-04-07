import PropTypes from 'prop-types';
import { nanoid } from 'nanoid';
import {
  ChatContainer, InputContainer, MessagesContainer,
} from './styles';
import InputEditor from '../InputEditor';
import { MessageStatus, MessageType } from '../../constants/Message';
import { isEmpty } from '../../utils/validators';
import Messages from '../Messages';
import useUser from '../../customHooks/useUser';

// chat component should be independent of channel/server logic
// to support personal messages in future
const Chat = (props) => {
  const {
    sendMessage,
    messagesData,
    loadMoreMessages,
  } = props;

  const {
    data,
    isLoading,
    error,
    hasMore,
    isLoadingMore,
  } = messagesData;

  // const messageContainerRef = useRef();
  const { user } = useUser();

  const prepareMessage = (message, type = MessageType.TEXT) => {
    // nanoid and createdAt will work as temporary id and
    // temporart createdAt, till message is sent
    sendMessage({
      content: message,
      type,
      id: nanoid(),
      status: MessageStatus.SENDING,
      createdAt: new Date().toString(),
      user: {
        name: user.name,
        id: user.id,
        profilePicture: user.profilePicture,
      },
    });
  };

  const getMoreMessages = () => {
    console.log('Has more messages: ', hasMore);
    if (!hasMore) {
      // TODO: show no message notficition;
      return;
    }
    if (isLoadingMore) return;
    loadMoreMessages();
  };

  const mainJSX = () => {
    if (isLoading) return <div>TODO: Fetching messages...</div>;
    if (error) return <div>TODO: Error fetching messages...Retry</div>; // TODO
    return (
      <>
        <MessagesContainer>
          {isEmpty(data) ? <div>No messages in this channel yet</div>
            : (
              <Messages
                hasMoreMessages={hasMore}
                messages={data}
                getMoreMessages={getMoreMessages}
                isLoadingMore={!!isLoadingMore}
              />
            )}
        </MessagesContainer>
        <InputContainer>
          <InputEditor prepareMessage={prepareMessage} />
        </InputContainer>
      </>
    );
  };

  return (
    <ChatContainer>
      {mainJSX()}
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
    isLoadingMore: PropTypes.bool,
  }).isRequired,
  loadMoreMessages: PropTypes.func.isRequired,
};

export default Chat;
