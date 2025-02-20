import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Badge from '@mui/material/Badge';
import {
  AvatarWrapper,
  ServerListTooltip,
  StyledAvatar,
  VerticalBar,
} from './styles';
import { getServerNotificationsData } from '../../redux/reducers';

const ServerNotification = ({ server }) => {
  const serverNotifications = useSelector((state) =>
    getServerNotificationsData(state, server.id)
  );

  const notificationCount = useMemo(() => {
    let total = 0;
    if (!serverNotifications) return total;
    Object.values(serverNotifications).forEach((channelNotifications) => {
      total += channelNotifications.count ?? 0;
    });
    return total;
  }, [serverNotifications]);

  return (
    <NavLink to={`/channels/${server.id}`}>
      {({ isActive }) => (
        <AvatarWrapper>
          <ServerListTooltip title={server.name} placement="right">
            <Badge
              color="secondary"
              overlap="circular"
              badgeContent={notificationCount}
              max={999}
            >
              <StyledAvatar
                src={server.avatar}
                selected={isActive}
                capitalize={true.toString()}
              >
                {server.name}
              </StyledAvatar>
            </Badge>
          </ServerListTooltip>
          <VerticalBar selected={isActive} />
        </AvatarWrapper>
      )}
    </NavLink>
  );
};

ServerNotification.propTypes = {
  server: PropTypes.objectOf(PropTypes.any).isRequired,
};

const ServersList = ({ servers }) =>
  Object.values(servers).map((server) => (
    <ServerNotification key={server.id} server={server} />
  ));

ServersList.propTypes = {
  servers: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default ServersList;
