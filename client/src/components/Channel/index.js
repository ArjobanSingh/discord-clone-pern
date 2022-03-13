// import PropTypes from 'prop-types';
import {
  memo, useMemo, Fragment, useEffect,
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
import { channelMessagesRequested, sendChannelMessageRequested } from '../../redux/actions/channels';

const wideScreenDrawerProps = {
  variant: 'persistent',
  sx: {
    flexShrink: 0,
    display: { xs: 'none', sm: 'block' },
    width: membersDrawerWidth,
    '& .MuiDrawer-paper': {
      boxSizing: 'border-box',
      width: membersDrawerWidth,
    },
  },
};

const emptyChannel = {
  error: null,
  data: null,
  isLoading: true,
  hasMore: true,
};

// TODO: maybe change drawers logic in future
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

  const sendMessage = (content) => {
    dispatch(sendChannelMessageRequested(serverId, channelId, content));
  };

  return (
    <ChannelContainer>
      <MainContent isDrawerOpen={isMembersDrawerOpen}>
        <Chat messagesData={messagesData} sendMessage={sendMessage} />
      </MainContent>

      <ResponsiveDrawer
        mobileOpen={isMembersDrawerOpen}
        open={isMembersDrawerOpen}
        anchor="right"
        closeDrawer={closeMembersDrawer}
        wideScreenDrawerProps={wideScreenDrawerProps}
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
