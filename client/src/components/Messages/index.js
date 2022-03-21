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
  const { messages, getMoreMessages } = props;
  const containerRef = useRef();
  const lastScrollPositions = useRef({});

  const [referenceMessageId, setReferenceMessageId] = useState(null);

  const scrollToContainerBottom = useCallback(() => scrollToBottom(containerRef.current), []);

  useEffect(() => {
    scrollToContainerBottom();
  }, []);

  useDidUpdate(() => {
    if (reachedThresholdBottom(lastScrollPositions.current, 10)) {
      scrollToContainerBottom();
    }
  }, [messages.length]);

  const handleScroll = (e) => {
    const { scrollHeight, scrollTop, clientHeight } = e.target;
    lastScrollPositions.current = {
      scrollHeight,
      scrollTop,
      clientHeight,
    };
    if (reachedThresholdTop(e, 50)) {
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
              scrollToReferenceMessage={scrollToReferenceMessage}
              isScrollToReference={referenceMessageId === currentMessage.id}
              setReferenceMessageId={setReferenceMessageId}
              scrollToContainerBottom={scrollToContainerBottom}
              isLastMessage={index === messages.length - 1}
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
};

export default Messages;
