// import PropTypes from 'prop-types';
import {
  memo, useMemo, Fragment, useEffect, useCallback,
} from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useOutletContext, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ChannelContainer,
  MainContent,
  MemberListContainer,
  membersDrawerWidth,
  MemberWrapper,
  StyledAvatar,
} from './styles';
import ResponsiveDrawer from '../../common/ResponsiveDrawer';
import Logo from '../../common/Logo';
import { isEmpty } from '../../utils/validators';
import { ServerMemberRoles } from '../../constants/servers';
import { getChannelData, getChannelMessagesData } from '../../redux/reducers';
import Chat from '../Chat';
import {
  channelMessagesRequested,
  channelMoreMessagesRequested,
  removeChannelMessageObjectUrl,
  sendChannelMessageRequested,
} from '../../redux/actions/channels';
import { MessageType } from '../../constants/Message';
import { getFileDimensions } from '../../utils/helperFunctions';
import MessageProvider from '../../providers/MessageProvider';

const wideScreenDrawerProps = (isDrawerOpen) => ({
  variant: 'persistent',
  sx: {
    flexShrink: 0,
    display: { xs: 'none', sm: 'block' },
    width: isDrawerOpen ? membersDrawerWidth : 0,
    '& .MuiDrawer-paper': {
      boxSizing: 'border-box',
      width: membersDrawerWidth,
    },
  },
});

const emptyChannel = {
  error: null,
  data: [],
  isLoading: true,
  hasMore: true,
};

const dimensionsSupportedTypes = [MessageType.IMAGE, MessageType.VIDEO];

// TODO: maybe change drawers logic in future
// on server change, channel will unmount and remount, as user gets navigated
// to new server initally with no channelId, and then navigated to first channel of server
const Channel = (props) => {
  // const params = useParams();
  const { serverId, channelId } = useParams();
  const channel = useSelector((state) => getChannelData(state, serverId, channelId));
  const messagesData = useSelector((state) => getChannelMessagesData(state, channelId))
    ?? emptyChannel;
  const dispatch = useDispatch();

  const {
    setOpenedChannel,
    closeMembersDrawer,
    isExploringServer,
    isMembersDrawerOpen,
    members,
  } = useOutletContext();

  useEffect(() => {
    if (serverId && channelId) {
      // whenever these change, fetch messages
      dispatch(channelMessagesRequested(serverId, channelId));
    }
  }, [serverId, channelId]);

  const membersInHierarchy = useMemo(() => {
    const result = {
      [ServerMemberRoles.OWNER]: [],
      [ServerMemberRoles.ADMIN]: [],
      [ServerMemberRoles.MODERATOR]: [],
      [ServerMemberRoles.USER]: [],
    };
    members.forEach((member) => {
      result[member.role].push(member);
    });
    return result;
  }, [members]);

  useEffect(() => {
    if (channel?.name) {
      setOpenedChannel(channel);
      return;
    }
    setOpenedChannel({});
  }, [channel?.name, channel?.type]);

  if (!channel) {
    return <div>TODO: NO such channel</div>;
  }

  const sendMessage = async (content) => {
    const messageObj = content;
    if (dimensionsSupportedTypes.includes(messageObj.type)) {
      messageObj.fileDimensions = await getFileDimensions(messageObj);
    }
    dispatch(sendChannelMessageRequested(serverId, channelId, messageObj));
  };

  const getMoreChannelMessages = () => {
    dispatch(channelMoreMessagesRequested(serverId, channelId));
  };

  const removeObjectUrl = useCallback((messageId) => {
    dispatch(removeChannelMessageObjectUrl(channelId, messageId));
  }, [dispatch, channelId]);

  const messageProviderValue = useMemo(() => ({
    removeObjectUrl,
  }), [removeObjectUrl]);

  return (
    <ChannelContainer>
      <MainContent isDrawerOpen={isMembersDrawerOpen}>
        <MessageProvider value={messageProviderValue}>
          <Chat
            messagesData={messagesData}
            sendMessage={sendMessage}
            loadMoreMessages={getMoreChannelMessages}
          />
        </MessageProvider>
      </MainContent>

      <ResponsiveDrawer
        mobileOpen={isMembersDrawerOpen}
        open={isMembersDrawerOpen}
        anchor="right"
        closeDrawer={closeMembersDrawer}
        wideScreenDrawerProps={wideScreenDrawerProps(isMembersDrawerOpen)}
        drawerWidth={membersDrawerWidth}
        boxProps={{
          sx: {
            transform: isMembersDrawerOpen ? '' : `translateX(${membersDrawerWidth}px)`,
            transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
          },
        }}
      >
        <MemberListContainer isExploringServer={isExploringServer}>
          {Object.entries(membersInHierarchy).map(([memberRole, currentRoleMembers]) => {
            if (isEmpty(currentRoleMembers)) return null;
            const heading = (
              <Typography
                variant="subtitle2"
                color="text.secondaryDark"
                lineHeight="1"
              >
                {memberRole}
                {' '}
                -
                {' '}
                {currentRoleMembers.length}
              </Typography>
            );
            return (
              <Fragment key={memberRole}>
                <Box padding="10px 10px 0px">{heading}</Box>
                {currentRoleMembers.map((member) => (
                  <MemberWrapper key={member.userId}>
                    <StyledAvatar src={member.profilePicture}>
                      <Logo />
                    </StyledAvatar>
                    <Box display="flex" flexDirection="column">
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                      >
                        {member.userName}
                      </Typography>
                    </Box>
                  </MemberWrapper>
                ))}
              </Fragment>
            );
          })}

        </MemberListContainer>
      </ResponsiveDrawer>
    </ChannelContainer>
  );
};

Channel.propTypes = {

};

export default memo(Channel);
