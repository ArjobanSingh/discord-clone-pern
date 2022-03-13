import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Container, MessagesWrapper } from './styles';

const Messages = (props) => {
  const { messages } = props;
  const containerRef = useRef();

  return (
    <Container ref={containerRef}>
      <MessagesWrapper>
        {messages.map((msg) => (
          <div key={msg.id}>{msg.content}</div>
        ))}
      </MessagesWrapper>
    </Container>
  );
};

Messages.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Messages;
