import { useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import Typography from '@mui/material/Typography';
import Zoom from '@mui/material/Zoom';
import { ServerMemberRoles } from '../../constants/servers';
import { handleEnter } from '../../utils/helperFunctions';
import ServerSettings from '../ServerSettings';

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

  const [isServerDetailsOpen, setIsServerDetailsOpen] = useState(false);

  const openServerSettings = () => {
    setIsServerDetailsOpen(true);
  };
  const createChannel = () => {};
  const leaveServer = () => {};

  const clickHanlders = {
    [SERVER_SETTINGS]: openServerSettings,
    [CREATE_CHANNEL]: createChannel,
    [LEAVE_SERVER]: leaveServer,
  };

  const closeServerSettings = () => {
    setIsServerDetailsOpen(false);
  };

  const [serverSettings] = settings;
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
      {serverSettings.roles.includes(currentRole) && (
      <Dialog
        fullScreen
        open={isServerDetailsOpen}
        onClose={closeServerSettings}
        TransitionComponent={Zoom}
      >
        <ServerSettings currentRole={currentRole} closeServerSettings={closeServerSettings} />
      </Dialog>
      )}
    </>
  );
};

ServerSettingsMenu.propTypes = {
  currentRole: PropTypes.oneOf(Object.keys(ServerMemberRoles)).isRequired,
};

export default ServerSettingsMenu;
