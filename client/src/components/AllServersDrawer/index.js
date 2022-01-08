import PropTypes from 'prop-types';
import {
  NavLink,
} from 'react-router-dom';
import useUser from '../../customHooks/userUser';
import { getCharacterName } from '../../utils/helperFunctions';
import {
  AvatarWrapper,
  Bar, ServerIconList, SidebarContainer, StyledAvatar, VerticalBar,
} from './styles';
import Logo from '../../common/Logo';

const AllServersDrawer = (props) => {
  const { user: { servers } } = useUser();

  return (
    <SidebarContainer>
      <ServerIconList>
        <NavLink to="@me">
          {({ isActive }) => (
            <AvatarWrapper>
              <StyledAvatar
                selected={isActive}
              >
                <Logo />
              </StyledAvatar>
              <VerticalBar selected={isActive} />
            </AvatarWrapper>
          )}
        </NavLink>

        <Bar />
        {servers.map((server) => (
          <NavLink to={server.serverId} key={server.serverId}>
            {({ isActive }) => (
              <AvatarWrapper>
                <StyledAvatar
                  src={server.avatar}
                  selected={isActive}
                >
                  {getCharacterName(server.serverName)}
                </StyledAvatar>
                <VerticalBar selected={isActive} />
              </AvatarWrapper>
            )}
          </NavLink>
        ))}
      </ServerIconList>
    </SidebarContainer>
  );
};

AllServersDrawer.propTypes = {

};

export default AllServersDrawer;
