import PropTypes from 'prop-types';
import { nanoid } from 'nanoid';
import {
  useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import { toast } from 'react-toastify';
import {
  ChatContainer, InputContainer, MessagesContainer,
} from './styles';
import InputEditor from '../InputEditor';
import { MessageStatus, MessageType } from '../../constants/Message';
import { isEmpty } from '../../utils/validators';
import Messages from '../Messages';
import useUser from '../../customHooks/useUser';
import { scrollToBottom } from '../../utils/helperFunctions';
import useDidUpdate from '../../customHooks/useDidUpdate';

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
  const messagesRef = useRef();

  const [replyMessage, setReplyMessage] = useState({});
  const [files, setFiles] = useState([]);

  useDidUpdate(() => {
    if (!isEmpty(files)) messagesRef.current.scrollToPreviousPosition();
  }, [files], false);

  // nanoid and createdAt will work as temporary id and
  // temporart createdAt, till message is sent
  const getObj = (id = nanoid(), content, type, fileObject = {}) => ({
    content,
    type,
    id,
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
    ...fileObject,
  });

  const prepareMessage = (message) => {
    if (isEmpty(files)) sendMessage(getObj(nanoid(), message, MessageType.TEXT));
    else {
      files.forEach((file) => {
        const { type, name, size } = file.originalFile;
        sendMessage(getObj(
          file.id,
          file.caption,
          file.messageType,
          {
            file: file.originalFile,
            fileMimeType: type,
            fileName: name,
            fileSize: size,
            url: file.url,
          },
        ));
      });
    }
    setReplyMessage((prev) => (prev.id ? {} : prev));
    setFiles([]);
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
                ref={messagesRef}
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
