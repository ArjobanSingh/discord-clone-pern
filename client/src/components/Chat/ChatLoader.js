/* eslint-disable react/no-array-index-key */
import PropTypes from 'prop-types';
import Skeleton from '@mui/material/Skeleton';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 8px;
`;

const MessagesLoaderList = styled.div`
  width: 100%;
  flex: 1;
  
  position: relative;
`;

const AbsoluteContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  gap: 16px;
`;

const MessageWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;

  .message-title-loader {
    display: flex;
    gap: 10px
  }

  .message-body-loader {
    width: 100%;
  }
`;

const SingleLoader = ({ type }) => (
  <MessageWrapper>
    <Skeleton
      variant="circular"
      width="40px"
      height="40px"
      animation="wave"
      sx={{ minWidth: '40px', minHeight: '40px' }}
    />
    <div className="message-body-loader">
      <div className="message-title-loader">
        <Skeleton animation="wave" variant="text" height="1rem" width="60px" />
        <Skeleton animation="wave" variant="text" height="1rem" width="30px" />
      </div>
      <Skeleton
        variant="rectangular"
        height={type === 'IMAGE' ? '200px' : '60px'}
        width={type === 'IMAGE' ? '300px' : '70%'}
        sx={{ margin: '5px 0 0', borderRadius: '5px' }}
        animation="wave"
      />
      <Skeleton animation="wave" variant="text" height="1rem" width="50%" />
      <Skeleton animation="wave" variant="text" height="1rem" width="45%" />
    </div>
  </MessageWrapper>
);

SingleLoader.propTypes = {
  type: PropTypes.string.isRequired,
};

const LoaderMessages = ['TEXT', 'IMAGE', 'TEXT', 'TEXT'];

// index can work as key, as they will never reorder or update
const ChatLoader = () => (
  <Container>
    <MessagesLoaderList>
      <AbsoluteContainer>
        {LoaderMessages.map((loader, idx) => (
          <SingleLoader type={loader} key={idx} />
        ))}
      </AbsoluteContainer>
    </MessagesLoaderList>
    <Skeleton
      variant="rectangular"
      width="100%"
      height="50px"
      animation="wave"
      sx={{ borderRadius: '5px', minHeight: '50px' }}
    />
  </Container>
);

ChatLoader.propTypes = {

};

export default ChatLoader;
