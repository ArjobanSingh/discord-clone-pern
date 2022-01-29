// import PropTypes from 'prop-types';
import { memo, useMemo, Fragment } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useOutletContext, useParams } from 'react-router-dom';
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

// TODO: maybe change drawers logic in future
const Channel = (props) => {
  const params = useParams();

  const {
    closeMembersDrawer,
    isMembersDrawerOpen,
    members,
  } = useOutletContext();

  const membersInHierarchy = useMemo(() => {
    const result = {
      OWNER: [],
      ADMIN: [],
      MODERATOR: [],
      USER: [],
    };
    members.forEach((member) => {
      result[member.role].push(member);
    });
    return result;
  }, [members]);

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

  return (
    <ChannelContainer>
      <MainContent isDrawerOpen={isMembersDrawerOpen}>
        Single channel messages
        {' '}
        {params.channelId}
        {' '}
        and some extra stuff and what not again testing and again and some
        random text, lets see how far it can go and again some messages and let
        see how far it can go
      </MainContent>

      <ResponsiveDrawer
        mobileOpen={isMembersDrawerOpen}
        open={isMembersDrawerOpen}
        anchor="right"
        closeDrawer={closeMembersDrawer}
        wideScreenDrawerProps={wideScreenDrawerProps}
        drawerWidth={membersDrawerWidth}
      >
        <MemberListContainer>
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
