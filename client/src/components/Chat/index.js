import PropTypes from 'prop-types';
import { nanoid } from 'nanoid';
import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
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
    moreError,
  } = messagesData;

  const isAlertShownAlready = useRef(false);
  const { user } = useUser();

  const [replyMessage, setReplyMessage] = useState({});
  const [files, setFiles] = useState([]);

  const prepareMessage = (message, type = MessageType.TEXT) => {
    // nanoid and createdAt will work as temporary id and
    // temporart createdAt, till message is sent
    sendMessage({
      content: message,
      type,
      id: nanoid(),
      status: MessageStatus.SENDING,
      createdAt: new Date().toString(),
      // if reply Message will be present use it's id otherwise it will be undefined
      referenceMessageId: replyMessage.id,
      referenceMessage: isEmpty(replyMessage) ? undefined : replyMessage,
      user: {
        name: user.name,
        id: user.id,
        profilePicture: user.profilePicture,
      },
    });
    setReplyMessage((prev) => (prev.id ? {} : prev));
  };

  const getMoreMessages = () => {
    if (!hasMore) {
      if (!isAlertShownAlready.current) {
        toast('No more messages to load');
        isAlertShownAlready.current = true;
      }
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
                moreError={!!moreError}
                replyMessage={replyMessage}
                setReplyMessage={setReplyMessage}
              />
            )}
        </MessagesContainer>
        <InputContainer>
          <InputEditor
            replyMessage={replyMessage}
            setReplyMessage={setReplyMessage}
            prepareMessage={prepareMessage}
            files={files}
            setFiles={setFiles}
          />
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
    moreError: PropTypes.string,
  }).isRequired,
  loadMoreMessages: PropTypes.func.isRequired,
};

export default Chat;
