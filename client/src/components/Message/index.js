import {
  memo, useCallback, useLayoutEffect, useMemo, useRef, useState,
} from 'react';
import { toast } from 'react-toastify';
import ReplyIcon from '@mui/icons-material/Reply';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material';
import { MessageStatus, MessageType, MessageUserPropType } from '../../constants/Message';
import {
  AvatarMessageContainer,
  HoverableTime,
  MessageContainer,
  MessageContent,
  SameUserMessage,
  StyledAvatar,
  OptionsContainer,
  TextContent,
} from './styles';
import Logo from '../../common/Logo';
import {
  downloadFile, formatDate, getTime, sameDay, stringToColor,
} from '../../utils/helperFunctions';
import DateMessage from '../MessageTypes/DateMessage';
import ReferenceMessage from '../MessageTypes/ReferenceMessage';
import useDidUpdate from '../../customHooks/useDidUpdate';
import ImageMessage from '../MessageTypes/ImageMessage';
import VideoMessage from '../MessageTypes/VideoMessage';
import AudioMessage from '../MessageTypes/AudioMessage';
import FileMessage from '../MessageTypes/FileMessage';
import { useMessageData } from '../../providers/MessageProvider';
import StyledTooltip from '../../common/StyledToolTip';

const Message = (props) => {
  const {
    message,
    isScrollToReference,
    setReferenceMessageId,
    isSameUser,
    isSameDay,
    scrollToReferenceMessage,
    scrollToContainerBottom,
    replyMessage,
    setReplyMessage,
    setOpenSelectedImage,
  } = props;

  const { retryFailedMessage, deleteMessage } = useMessageData();
  // const { user: currentUser } = useUser();
  const [shouldHighlight, setShouldHighlight] = useState(false);

  const elementRef = useRef();

  const {
    type,
    content,
    id,
    user,
    createdAt,
    referenceMessage,
    status,
    fileUrl,
    fileName,
  } = message;

  const appTheme = useTheme();

  const isLoading = status === MessageStatus.SENDING;
  const isFailed = status === MessageStatus.FAILED;

  useLayoutEffect(() => {
    if (status === MessageStatus.SENDING) {
      // we just sent this new message, scroll container to bottom
      scrollToContainerBottom();
    }
  }, [status]);

  const userNameColor = useMemo(() => stringToColor(user.name), [user.name]);

  const isMessageSentToday = sameDay(Date.now(), message.createdAt);
  //   const isMessageByCurrentUser = user.id === currentUser.id;

  // if message send by same user as previous one and on same day
  // and also is not reply to some other message, show simple
  // message ui, without Avatar etc
  const isSimpleInlineMessage = isSameDay && isSameUser && !referenceMessage;

  const handleReply = () => {
    setReplyMessage(message);
  };

  const retryMessage = () => {
    retryFailedMessage(message);
  };

  const deleteCurrentMessage = () => {
    deleteMessage(id);
  };

  useDidUpdate(() => {
    let timeout;
    if (isScrollToReference) {
      elementRef.current.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
      setShouldHighlight(true);
      timeout = setTimeout(() => {
        setReferenceMessageId(null);
      }, 1000);
    } else setShouldHighlight(false);

    return () => {
      clearInterval(timeout);
    };
  }, [isScrollToReference]);

  const downloadCurrentFile = useCallback(() => {
    if (message.status === MessageStatus.SENDING) return;
    try {
      downloadFile(fileUrl, fileName);
    } catch (err) {
      toast.error('Error downloading current file, Please try again later');
    }
  }, [message.status, fileUrl, fileName]);

  const commonProps = { message, downloadCurrentFile };

  const getMessageComponent = () => {
    switch (type) {
      case MessageType.IMAGE:
        return <ImageMessage {...commonProps} setOpenSelectedImage={setOpenSelectedImage} />;
      case MessageType.VIDEO:
        return <VideoMessage {...commonProps} />;
      case MessageType.AUDIO:
        return <AudioMessage {...commonProps} />;
      case MessageType.FILE:
        return <FileMessage {...commonProps} />;
      default:
        return null;
    }
  };

  const getMessageBody = () => {
    if (isSimpleInlineMessage) {
      return (
        <SameUserMessage>
          <HoverableTime>
            {getTime(createdAt)}
          </HoverableTime>
          <MessageContent
            variant="subtitle1"
            marginLeft="55px"
            component="div"
            isLoading={isLoading}
            isFailed={isFailed}
          >
            {getMessageComponent()}
            <TextContent>{content}</TextContent>
          </MessageContent>
        </SameUserMessage>
      );
    }

    return (
      <div>
        {!!referenceMessage && (
        <ReferenceMessage
          scrollToReferenceMessage={scrollToReferenceMessage}
          message={referenceMessage}
        />
        )}
        <AvatarMessageContainer>
          <StyledAvatar src={user.profilePicture}>
            <Logo />
          </StyledAvatar>
          <div>
            <Box display="flex" gap="10px" alignItems="center">
              <Typography
                variant="subtitle1"
                // color="primary.main"
                color={userNameColor}
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
            <MessageContent
              variant="subtitle1"
              component="div"
              isLoading={isLoading}
              isFailed={isFailed}
            >
              {getMessageComponent()}
              <TextContent>{content}</TextContent>
            </MessageContent>
          </div>
        </AvatarMessageContainer>
      </div>
    );
  };

  const failedMessageOptions = () => (
    <>
      <div>
        <StyledTooltip
          fontSize={appTheme.typography.subtitle1.fontSize}
          placement="top"
          title="Retry message"
        >
          <RefreshIcon onClick={retryMessage} />
        </StyledTooltip>
      </div>
      <div>
        <StyledTooltip
          fontSize={appTheme.typography.subtitle1.fontSize}
          placement="top"
          title="Delete message"
        >
          <DeleteIcon onClick={deleteCurrentMessage} />
        </StyledTooltip>
      </div>
    </>
  );

  const sentMessageOptions = () => (
    <>
      <div>
        <StyledTooltip
          fontSize={appTheme.typography.subtitle1.fontSize}
          placement="top"
          title="Reply"
        >
          <ReplyIcon onClick={handleReply} />
        </StyledTooltip>
      </div>
      {/* TODO: add this feature when completed */}
      {/* <div>
        <StyledTooltip
          fontSize={appTheme.typography.subtitle1.fontSize}
          placement="top"
          title="More"
        >
          <MoreHorizIcon />
        </StyledTooltip>
      </div> */}
    </>
  );

  return (
    <>
      {!isSameDay && (
        <DateMessage date={message.createdAt} />
      )}
      <MessageContainer
        ref={elementRef}
        shouldHighlight={shouldHighlight}
        hideMargin={isSimpleInlineMessage}
        isReplyMessage={id === replyMessage.id}
        id={id}
      >
        {getMessageBody()}
        {status !== MessageStatus.SENDING && (
          <OptionsContainer>
            {status === MessageStatus.FAILED
              ? failedMessageOptions()
              : sentMessageOptions()}
          </OptionsContainer>
        )}
      </MessageContainer>
    </>
  );
};

Message.propTypes = {
  message: PropTypes.shape({
    type: PropTypes.oneOf(Object.keys(MessageType)).isRequired,
    content: PropTypes.string,
    id: PropTypes.string,
    status: PropTypes.oneOf(Object.keys(MessageStatus)).isRequired,
    createdAt: PropTypes.string,
    user: PropTypes.shape(MessageUserPropType).isRequired,
    fileUrl: PropTypes.string,
    fileName: PropTypes.string,
    referenceMessage: PropTypes.shape({
      user: PropTypes.shape(MessageUserPropType).isRequired,
      content: PropTypes.string,
      type: PropTypes.oneOf(Object.keys(MessageType)).isRequired,
    }),
  }).isRequired,
  isSameUser: PropTypes.bool.isRequired,
  isSameDay: PropTypes.bool.isRequired,
  scrollToReferenceMessage: PropTypes.func.isRequired,
  isScrollToReference: PropTypes.bool.isRequired,
  setReferenceMessageId: PropTypes.func.isRequired,
  scrollToContainerBottom: PropTypes.func.isRequired,
  replyMessage: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  setReplyMessage: PropTypes.func.isRequired,
  setOpenSelectedImage: PropTypes.func.isRequired,
};

export default memo(Message);
