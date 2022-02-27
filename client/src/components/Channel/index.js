// import PropTypes from 'prop-types';
import {
  memo, useMemo, Fragment, useEffect,
} from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useOutletContext, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import { getChannelData } from '../../redux/reducers';
import socketHandler from '../../services/socket-client';
import useUser from '../../customHooks/useUser';

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

// TODO: maybe change drawers logic in future
const Channel = (props) => {
  const params = useParams();
  const { serverId, channelId } = useParams();
  const { user: { id } } = useUser();
  const channel = useSelector((state) => getChannelData(state, serverId, channelId));

  const {
    setOpenedChannel,
    closeMembersDrawer,
    isExploringServer,
    isMembersDrawerOpen,
    members,
  } = useOutletContext();

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

  const sendMessage = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const value = formData.get('message-input');

    if (value.trim()) {
      socketHandler.emitEvent('send-message', { message: value, serverId }, () => {
        console.log('Message sent by this user', value, serverId, id);
      });
    }
  };

  if (!channel) {
    return <div>TODO: NO such channel</div>;
  }

  return (
    <ChannelContainer>
      <MainContent isDrawerOpen={isMembersDrawerOpen}>
        {channel.name}
        {' '}
        {params.channelId}
        <form onSubmit={sendMessage}>
          <input name="message-input" />
        </form>
      </MainContent>

      <ResponsiveDrawer
        mobileOpen={isMembersDrawerOpen}
        open={isMembersDrawerOpen}
        anchor="right"
        closeDrawer={closeMembersDrawer}
        wideScreenDrawerProps={wideScreenDrawerProps}
        drawerWidth={membersDrawerWidth}
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
