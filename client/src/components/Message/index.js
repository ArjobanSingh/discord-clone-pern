import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { MessageType } from '../../constants/Message';
import { MessageContainer, StyledAvatar } from './styles';
import Logo from '../../common/Logo';
import useUser from '../../customHooks/useUser';
import { formatDate, getTime, sameDay } from '../../utils/helperFunctions';
import DateMessage from '../MessageTypes/DateMessage';

const Message = (props) => {
  const { message, isSameUser, isSameDay } = props;
  const { user: currentUser } = useUser();

  const {
    type, content, id, user, createdAt,
  } = message;

  const isMessageSentToday = sameDay(Date.now(), message.createdAt);

  //   const isMessageByCurrentUser = user.id === currentUser.id;

  const getMessageBody = () => {
    if (isSameUser && isSameDay) {
      return (
        <Typography
          variant="subtitle1"
          color="text.primary"
          lineHeight="1.3"
          marginLeft="50px"
        >
          {content}
        </Typography>
      );
    }

    return (
      <Box
        display="flex"
        gap="10px"
      >
        <StyledAvatar src={user.profilePicture}>
          <Logo />
        </StyledAvatar>
        <div>
          <Box display="flex" gap="10px" alignItems="center">
            <Typography
              variant="subtitle1"
              color="primary.main"
              lineHeight="1.2"
              fontWeight="fontWeightBold"
            >
              {user.name}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondaryDark"
              lineHeight="1"
            >
              {isMessageSentToday
                ? getTime(createdAt)
                : formatDate(createdAt)}
            </Typography>
          </Box>
          <Typography
            variant="subtitle1"
            color="text.primary"
            lineHeight="1.3"
          >
            {content}
          </Typography>
        </div>
      </Box>
    );
  };

  return (
    <>
      {!isSameDay && (
        <DateMessage date={message.createdAt} />
      )}
      <MessageContainer hideMargin={isSameUser && isSameDay} id={id}>
        {getMessageBody()}
      </MessageContainer>
    </>
  );
};

Message.propTypes = {
  message: PropTypes.shape({
    type: PropTypes.oneOf(Object.keys(MessageType)).isRequired,
    content: PropTypes.string,
    id: PropTypes.string,
    createdAt: PropTypes.string,
    user: PropTypes.shape({
      profilePicture: PropTypes.string,
      id: PropTypes.string,
      name: PropTypes.string,
    }),
  }).isRequired,
  isSameUser: PropTypes.bool.isRequired,
  isSameDay: PropTypes.bool.isRequired,
};

export default memo(Message);
