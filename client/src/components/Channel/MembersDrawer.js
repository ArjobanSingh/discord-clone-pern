import React, { Fragment, useMemo } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ResponsiveDrawer from '../../common/ResponsiveDrawer';
import {
  MemberListContainer, membersDrawerWidth, MemberWrapper, StyledAvatar,
} from './styles';
import { ServerMemberRoles } from '../../constants/servers';
import { isEmpty } from '../../utils/validators';
import Logo from '../../common/Logo';

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

const MembersDrawer = ({
  isMembersDrawerOpen,
  closeMembersDrawer,
  isExploringServer,
  members,
}) => {
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

  return (
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
  );
};

MembersDrawer.propTypes = {
  isMembersDrawerOpen: PropTypes.bool.isRequired,
  closeMembersDrawer: PropTypes.func.isRequired,
  isExploringServer: PropTypes.bool.isRequired,
  members: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default MembersDrawer;
