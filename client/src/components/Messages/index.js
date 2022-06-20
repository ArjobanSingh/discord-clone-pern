import {
  forwardRef,
  useCallback, useEffect, useImperativeHandle, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  Container, MessagesWrapper, AbsoluteLoader, ImageModalWrapper,
} from './styles';
import Message from '../Message';
import {
  reachedThresholdBottom, reachedThresholdTop, sameDay, scrollToBottom,
} from '../../utils/helperFunctions';
import useDidUpdate from '../../customHooks/useDidUpdate';
import TransitionModal from '../../common/TransitionModal';
import ModalImage from './ModalImage';
import ChatInitialMessage from './ChatInitialMessage';

const Messages = forwardRef((props, ref) => {
  const {
    messages,
    moreError,
    getMoreMessages,
    isLoadingMore,
    replyMessage,
    setReplyMessage,
    hasMoreMessages,
    chatBoxId,
    chatName,
  } = props;

  const containerRef = useRef();
  const lastScrollPositions = useRef({});
  const lastScrollHeight = useRef();

  const [referenceMessageId, setReferenceMessageId] = useState(null);
  const [openSelectedImage, setOpenSelectedImage] = useState(null);

  const scrollToContainerBottom = useCallback(() => scrollToBottom(containerRef.current), []);

  useImperativeHandle(ref, () => ({
    scrollToCorrectPosition: () => {
      if (reachedThresholdBottom(lastScrollPositions.current, 10)) {
        scrollToContainerBottom();
      }
    },
  }));

  useEffect(() => {
    // on chat box change, reset lastScrollHeight for case
    // if previous chat box's(previous channel) more api was
    // in progress and user changed chatBox(channel)
    scrollToContainerBottom();
    lastScrollHeight.current = undefined;
    lastScrollPositions.current = {};
  }, [chatBoxId]);

  useDidUpdate(() => {
    // basically when we have completed loading more messages
    if (lastScrollHeight.current && !isLoadingMore) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight - lastScrollHeight.current;
      lastScrollHeight.current = undefined;
      return;
    }

    // if we are at bottom and some new message came, scroll to bottom
    // TODO: enhancement another approach could be saving new timestamp whenever new message
    // comes, and using that flag in deps array
    if (reachedThresholdBottom(lastScrollPositions.current, 10)) {
      scrollToContainerBottom();
    }
  }, [messages.length], false);

  useDidUpdate(() => {
    if (moreError) lastScrollHeight.current = undefined;
  }, [moreError]);

  const handleScroll = (e) => {
    const { scrollHeight, scrollTop, clientHeight } = e.target;
    lastScrollPositions.current = {
      scrollHeight,
      scrollTop,
      clientHeight,
    };
    if (hasMoreMessages && reachedThresholdTop(e, 50)) {
      lastScrollHeight.current = scrollHeight;
      getMoreMessages();
    }
  };

  const scrollToReferenceMessage = useCallback((refMessageId) => {
    const referenceMessageElement = document.getElementById(refMessageId);
    if (!referenceMessageElement) {
      // TODO: notify user or return;
      return;
    }
    setReferenceMessageId(refMessageId);
  }, []);

  const closeImageModal = () => setOpenSelectedImage(null);

  return (
    <>
      {isLoadingMore && <AbsoluteLoader />}
      <Container id="messages-container" ref={containerRef} onScroll={handleScroll}>
        <MessagesWrapper>
          <ChatInitialMessage
            chatName={chatName}
            hasMoreMessages={hasMoreMessages}
          />
          {messages.map((currentMessage, index) => {
            const previousMessage = messages[index - 1];

            // check if two messages are sent by same user
            const isSameUser = index === 0
              ? false
              : currentMessage.user.id === previousMessage.user.id;

            // is two messages sent same day
            const isSameDay = index === 0
              ? false
              : sameDay(currentMessage.createdAt, previousMessage.createdAt);

            // localKey for preventing remount when sending messages
            return (
              <Message
                key={currentMessage.localKey || currentMessage.id}
                isSameUser={isSameUser}
                isSameDay={isSameDay}
                message={currentMessage}
                isScrollToReference={referenceMessageId === currentMessage.id}
                scrollToReferenceMessage={scrollToReferenceMessage}
                setReferenceMessageId={setReferenceMessageId}
                scrollToContainerBottom={scrollToContainerBottom}
                setOpenSelectedImage={setOpenSelectedImage}
                replyMessage={replyMessage}
                setReplyMessage={setReplyMessage}
              />
            );
          })}
        </MessagesWrapper>
      </Container>
      <TransitionModal
        open={!!openSelectedImage}
        onClose={closeImageModal}
      >
        <ImageModalWrapper onClick={closeImageModal} open={!!openSelectedImage}>
          {!!openSelectedImage && <ModalImage {...(openSelectedImage || {})} />}
        </ImageModalWrapper>
      </TransitionModal>
    </>
  );
});

Messages.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  getMoreMessages: PropTypes.func.isRequired,
  isLoadingMore: PropTypes.bool.isRequired,
  moreError: PropTypes.bool.isRequired,
  replyMessage: PropTypes.shape({}).isRequired,
  setReplyMessage: PropTypes.func.isRequired,
  chatBoxId: PropTypes.string.isRequired,
  hasMoreMessages: PropTypes.bool.isRequired,
  chatName: PropTypes.string.isRequired,
};

export default Messages;
