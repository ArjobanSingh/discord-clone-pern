import PropTypes from 'prop-types';
import {
  NavLink,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getCharacterName } from '../../utils/helperFunctions';
import {
  AvatarWrapper,
  Bar,
  ServerIconList,
  SidebarContainer,
  StyledAvatar,
  VerticalBar,
} from './styles';
import Logo from '../../common/Logo';
import ChannelList from '../ChannelList';
import { getAllServers } from '../../redux/reducers';
import Explore from '../../common/Explore';

const AllServersDrawer = ({ isDiscoveryPage }) => {
  const servers = useSelector(getAllServers);

  return (
    <SidebarContainer>
      <ServerIconList>
        <NavLink to="/channels/@me">
          {({ isActive }) => (
            <AvatarWrapper>
              <StyledAvatar
                selected={isActive}
                fontSize="1.7rem"
              >
                <Logo />
              </StyledAvatar>
              <VerticalBar selected={isActive} />
            </AvatarWrapper>
          )}
        </NavLink>

        <Bar />
        {Object.values(servers).map((server) => (
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
        ))}

        <NavLink to="/guild-discovery">
          {({ isActive }) => (
            <AvatarWrapper>
              <StyledAvatar
                explore
                selected={isActive}
                fontSize="1.7rem"
              >
                <Explore />
              </StyledAvatar>
              <VerticalBar selected={isActive} />
            </AvatarWrapper>
          )}
        </NavLink>
      </ServerIconList>
      {!isDiscoveryPage && <ChannelList />}
    </SidebarContainer>
  );
};

AllServersDrawer.propTypes = {
  isDiscoveryPage: PropTypes.bool.isRequired,
};

export default AllServersDrawer;
