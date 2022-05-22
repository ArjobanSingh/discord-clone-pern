import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import Tag from '../../common/Tag';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.3rem;
  padding: ${({ theme }) => theme.spacing(2)};
`;

const TagWrapper = styled.div`
  height: 70px;
  width: 70px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.palette.background.paper};
  color: ${({ theme }) => theme.palette.text.secondaryDark};
  padding: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptyChat = ({ chatName }) => (
  <Container>
    <TagWrapper>
      <Tag fontSize="3rem" />
    </TagWrapper>
    <Typography
      color="text.primary"
      variant="h4"
      fontWeight="fontWeightBold"
    >
      Welcome to #
      {chatName}
    </Typography>
    <Typography
      color="text.secondaryDark"
      variant="body2"
    >
      This is the start of the #
      {chatName}
      {' '}
      channel.
    </Typography>
  </Container>
);

EmptyChat.propTypes = {
  chatName: PropTypes.string.isRequired,
};

export default EmptyChat;
