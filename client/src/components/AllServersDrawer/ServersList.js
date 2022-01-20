import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { AvatarWrapper, StyledAvatar, VerticalBar } from './styles';
import { getCharacterName } from '../../utils/helperFunctions';

const ServersList = ({ servers }) => Object.values(servers).map((server) => (
  <NavLink to={`/channels/${server.id}`} key={server.id}>
    {({ isActive }) => (
      <AvatarWrapper>
        <StyledAvatar
          src={server.avatar}
          selected={isActive}
        >
          {getCharacterName(server.name)}
        </StyledAvatar>
        <VerticalBar selected={isActive} />
      </AvatarWrapper>
    )}
  </NavLink>
));

ServersList.propTypes = {
  servers: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default ServersList;
