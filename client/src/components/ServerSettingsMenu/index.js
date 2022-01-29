import React from 'react';
import PropTypes from 'prop-types';
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import Typography from '@mui/material/Typography';
import { ServerMemberRoles } from '../../constants/servers';
import { handleEnter } from '../../utils/helperFunctions';

const {
  OWNER,
  ADMIN,
  MODERATOR,
  USER,
} = ServerMemberRoles;

const SERVER_SETTINGS = 'Server Settings';
const CREATE_CHANNEL = 'Create Channel';
const LEAVE_SERVER = 'Leave Server';

const settings = [{
  title: SERVER_SETTINGS,
  roles: [OWNER, ADMIN, MODERATOR],
  Icon: SettingsIcon,
  className: 'server-settings-item',
},
{
  title: CREATE_CHANNEL,
  roles: [OWNER, ADMIN],
  Icon: AddCircleIcon,
  className: 'server-settings-item',
},
{
  title: LEAVE_SERVER,
  roles: [ADMIN, MODERATOR, USER],
  Icon: LogoutIcon,
  className: 'server-settings-item leave-server',
}];

const ServerSettingsMenu = (props) => {
  const { currentRole } = props;

  const openServerSettings = () => {};
  const createChannel = () => {};
  const leaveServer = () => {};

  const clickHanlders = {
    [SERVER_SETTINGS]: openServerSettings,
    [CREATE_CHANNEL]: createChannel,
    [LEAVE_SERVER]: leaveServer,
  };

  return (
    <>
      {settings.map((setting) => {
        const {
          title,
          roles,
          Icon,
          className,
        } = setting;

        if (!roles.includes(currentRole)) return null;
        const clickHandler = clickHanlders[title];
        return (
          <div
            key={title}
            role="button"
            tabIndex="0"
            onClick={clickHandler}
            onKeyDown={handleEnter(clickHandler)}
            className={className}
          >
            <Typography variant="subtitle2">
              {title}
            </Typography>
            <Icon />
          </div>
        );
      })}

    </>
  );
};

ServerSettingsMenu.propTypes = {
  currentRole: PropTypes.oneOf(Object.keys(ServerMemberRoles)).isRequired,
};

export default ServerSettingsMenu;
