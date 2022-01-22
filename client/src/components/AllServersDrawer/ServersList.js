import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import {
  AvatarWrapper, ServerListTooltip, StyledAvatar, VerticalBar,
} from './styles';
import { getCharacterName } from '../../utils/helperFunctions';

const ServersList = ({ servers }) => Object.values(servers).map((server) => (
  <NavLink to={`/channels/${server.id}`} key={server.id}>
    {({ isActive }) => (
      <AvatarWrapper>
        <ServerListTooltip title={server.name} placement="right">
          <StyledAvatar
            src={server.avatar}
            selected={isActive}
          >
            {getCharacterName(server.name)}
          </StyledAvatar>
        </ServerListTooltip>
        <VerticalBar selected={isActive} />
      </AvatarWrapper>
    )}
  </NavLink>
));

ServersList.propTypes = {
  servers: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default ServersList;
