import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import { Container, MessagesWrapper } from './styles';
import Message from '../Message';
import {
  reachedThresholdBottom, reachedThresholdTop, sameDay, scrollToBottom,
} from '../../utils/helperFunctions';
import useDidUpdate from '../../customHooks/useDidUpdate';

const Messages = (props) => {
  const {
    messages, hasMoreMessages, getMoreMessages, isLoadingMore,
  } = props;
  const containerRef = useRef();
  const lastScrollPositions = useRef({});
  const lastScrollHeight = useRef();

  const [referenceMessageId, setReferenceMessageId] = useState(null);

  const scrollToContainerBottom = useCallback(() => scrollToBottom(containerRef.current), []);

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

  const handleScroll = (e) => {
    const { scrollHeight, scrollTop, clientHeight } = e.target;
    lastScrollPositions.current = {
      scrollHeight,
      scrollTop,
      clientHeight,
    };
    if (reachedThresholdTop(e, 50) && hasMoreMessages) {
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
    <Container ref={containerRef} onScroll={handleScroll}>
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

          return (
            <Message
              key={currentMessage.id}
              isSameUser={isSameUser}
              isSameDay={isSameDay}
              message={currentMessage}
              isScrollToReference={referenceMessageId === currentMessage.id}
              scrollToReferenceMessage={scrollToReferenceMessage}
              setReferenceMessageId={setReferenceMessageId}
              scrollToContainerBottom={scrollToContainerBottom}
            />
          );
        })}
      </MessagesWrapper>
    </Container>
  );
};

Messages.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
  getMoreMessages: PropTypes.func.isRequired,
  hasMoreMessages: PropTypes.bool.isRequired,
  isLoadingMore: PropTypes.bool.isRequired,
};

export default Messages;
