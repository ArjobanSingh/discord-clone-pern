import PropTypes from 'prop-types';
import styled from 'styled-components';
import EmptyChat from '../Chat/EmptyChat';

const Container = styled.div`
  width: 100%;
`;

const ChatInitialMessage = (props) => {
  const { hasMoreMessages, chatName } = props;

  if (hasMoreMessages) return null;

  return (
    <Container>
      <EmptyChat chatName={chatName} />
    </Container>
  );
};

ChatInitialMessage.propTypes = {
  hasMoreMessages: PropTypes.bool.isRequired,
  chatName: PropTypes.string.isRequired,
};

export default ChatInitialMessage;
