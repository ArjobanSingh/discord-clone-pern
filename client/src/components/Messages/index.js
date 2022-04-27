import {
  forwardRef,
  useCallback, useEffect, useImperativeHandle, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import { Container, MessagesWrapper, AbsoluteLoader } from './styles';
import Message from '../Message';
import {
  reachedThresholdBottom, reachedThresholdTop, sameDay, scrollToBottom,
} from '../../utils/helperFunctions';
import useDidUpdate from '../../customHooks/useDidUpdate';

const Messages = forwardRef((props, ref) => {
  const {
    messages,
    moreError,
    getMoreMessages,
    isLoadingMore,
    replyMessage,
    setReplyMessage,
  } = props;

  const containerRef = useRef();
  const lastScrollPositions = useRef({});
  const lastScrollHeight = useRef();

  const [referenceMessageId, setReferenceMessageId] = useState(null);

  const scrollToContainerBottom = useCallback(() => scrollToBottom(containerRef.current), []);

  useImperativeHandle(ref, () => ({
    scrollToPreviousPosition: () => {
      if (reachedThresholdBottom(lastScrollPositions.current, 10)) {
        scrollToContainerBottom();
      }
    },
  }));

  useEffect(() => {
    scrollToContainerBottom();
  }, []);

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
    if (reachedThresholdTop(e, 50)) {
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

  return (
    <>
      {isLoadingMore && <AbsoluteLoader />}
      <Container id="messages-container" ref={containerRef} onScroll={handleScroll}>
        <MessagesWrapper>
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
                replyMessage={replyMessage}
                setReplyMessage={setReplyMessage}
              />
            );
          })}
        </MessagesWrapper>
      </Container>
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
};

export default Messages;
