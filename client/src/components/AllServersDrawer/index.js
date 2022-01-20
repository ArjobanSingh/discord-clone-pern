import PropTypes from 'prop-types';
import {
  NavLink,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import { getAllExploreServersData, getAllServers } from '../../redux/reducers';
import Explore from '../../common/Explore';
import ServersList from './ServersList';

const AllServersDrawer = ({ isDiscoveryPage }) => {
  const servers = useSelector(getAllServers);
  const exploreServers = useSelector(getAllExploreServersData);

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

        <ServersList servers={exploreServers} />
        <Bar />
        <ServersList servers={servers} />

        <NavLink to="/guild-discovery">
          {({ isActive }) => (
            <AvatarWrapper>
              <StyledAvatar
                explore="true" // to prevent bool attribute being passed to dom element
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
