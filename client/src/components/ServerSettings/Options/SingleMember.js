import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import {
  MemberItem,
  MemberSettingIcon,
  RoleChip,
  StyledAvatar,
} from './styles';
import Logo from '../../../common/Logo';
import { ServerMemberRoles, ServerMemberScores } from '../../../constants/servers';
import { capitalize, handleEnter } from '../../../utils/helperFunctions';
import { SimpleEllipsis } from '../../../common/StyledComponents';

const SingleMember = ({ loggedInMember, currentMember, setUpdateRoleMenuData }) => {
  const isUserRoleSuperior = ServerMemberScores[loggedInMember.role]
    > ServerMemberScores[currentMember.role];

  const openRoleMenu = (e) => {
    if (!isUserRoleSuperior) return;
    setUpdateRoleMenuData({
      anchorEl: e.currentTarget,
      userId: currentMember.userId,
      currentUserRole: currentMember.role,
    });
  };

  return (
    <>
      <MemberItem key={currentMember.userId}>
        <StyledAvatar src={currentMember.profilePicture}>
          <Logo />
        </StyledAvatar>
        <Typography
          component="div"
          variant="subtitle2"
          color="text.secondary"
          lineHeight="normal"
          width="140px"
        >
          <SimpleEllipsis>
            {currentMember.userName}
            {loggedInMember.userId === currentMember.userId && ' (You)'}
          </SimpleEllipsis>
        </Typography>
        <RoleChip
          role={isUserRoleSuperior ? 'button' : 'presentation'}
          tabIndex={isUserRoleSuperior ? '0' : undefined}
          onKeyDown={isUserRoleSuperior ? handleEnter(openRoleMenu) : undefined}
          isUserRoleSuperior={isUserRoleSuperior}
          onClick={openRoleMenu}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            marginRight="auto"
            lineHeight="normal"
          >
            {capitalize(currentMember.role)}
          </Typography>
        </RoleChip>
        {isUserRoleSuperior && <MemberSettingIcon />}
      </MemberItem>
    </>
  );
};

SingleMember.propTypes = {
  currentMember: PropTypes.shape({
    role: PropTypes.oneOf(Object.values(ServerMemberRoles)).isRequired,
    userId: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    profilePicture: PropTypes.string,
  }).isRequired,
  loggedInMember: PropTypes.shape({
    role: PropTypes.oneOf(Object.values(ServerMemberRoles)).isRequired,
    userId: PropTypes.string.isRequired,
  }).isRequired,
  setUpdateRoleMenuData: PropTypes.func.isRequired,
};

export default SingleMember;
