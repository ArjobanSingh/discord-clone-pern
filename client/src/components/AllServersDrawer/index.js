import PropTypes from 'prop-types';
import {
  NavLink,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import useUser from '../../customHooks/userUser';
import { getCharacterName } from '../../utils/helperFunctions';
import {
  AvatarWrapper,
  Bar, ServerIconList, SidebarContainer, StyledAvatar, VerticalBar,
} from './styles';
import Logo from '../../common/Logo';
import ChannelList from '../ChannelList';

const AllServersDrawer = (props) => {
  const servers = useSelector((state) => state.servers);

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
        {Object.values(servers).map((server) => (
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
      <ChannelList />
    </SidebarContainer>
  );
};

AllServersDrawer.propTypes = {

};

export default AllServersDrawer;
