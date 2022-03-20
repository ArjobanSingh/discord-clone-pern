import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { MessageType, MessageUserPropType } from '../../../constants/Message';
import {
  AttachmentIcon,
  Bar,
  ContentContainer,
  ReferenceMessageContainer,
  ReferenceMessageContent,
  ReferenceText,
  StyledAvatar,
  UserName,
} from './styles';
import Logo from '../../../common/Logo';
import { handleEnter } from '../../../utils/helperFunctions';

const ReferenceMessage = (props) => {
  const { message, scrollToReferenceMessage } = props;
  const { user } = message;

  const isTextMessage = message.type === MessageType.TEXT;
  const handleClick = () => {
    scrollToReferenceMessage(message.id);
  };

  return (
    <ReferenceMessageContainer>
      <Bar />
      <ContentContainer>
        <StyledAvatar src={user.profilePicture}>
          <Logo />
        </StyledAvatar>
        <ReferenceText>
          <UserName>
            {user.name}
          </UserName>
          <ReferenceMessageContent
            role="button"
            tabIndex="0"
            onClick={handleClick}
            onKeyDown={handleEnter(handleClick)}
            isTextMessage={isTextMessage}
            linesCount={1}
          >
            {isTextMessage ? message.content : 'Click to see attachment'}
          </ReferenceMessageContent>
          {!isTextMessage && (
            <AttachmentIcon />
          )}
        </ReferenceText>
      </ContentContainer>
    </ReferenceMessageContainer>
  );
};

ReferenceMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    user: PropTypes.shape(MessageUserPropType).isRequired,
    content: PropTypes.string,
    type: PropTypes.oneOf(Object.keys(MessageType)).isRequired,
  }).isRequired,
  scrollToReferenceMessage: PropTypes.func.isRequired,
};

export default ReferenceMessage;
