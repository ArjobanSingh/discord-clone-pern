import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  AvatarWrapper,
  Bar,
  ServerListTooltip,
  ServerIconList,
  SidebarContainer,
  StyledAvatar,
  VerticalBar,
} from './styles';
// import Logo from '../../common/Logo';
import ChannelList from '../ChannelList';
import { getAllExploreServersData, getAllServers } from '../../redux/reducers';
import Explore from '../../common/Explore';
import ServersList from './ServersList';
import Add from '../../common/AddIcon';
import { isEmpty } from '../../utils/validators';

const AllServersDrawer = ({
  isDiscoveryPage,
  openCreateModal,
}) => {
  const servers = useSelector(getAllServers);
  const exploreServers = useSelector(getAllExploreServersData);

  return (
    <>
      <SidebarContainer>
        <ServerIconList>
          {/* <NavLink to="/channels/@me">
            {({ isActive }) => (
              <AvatarWrapper>
                <ServerListTooltip title="Home" placement="right">
                  <StyledAvatar
                    selected={isActive}
                    fontSize="1.7rem"
                  >
                    <Logo />
                  </StyledAvatar>
                </ServerListTooltip>
                <VerticalBar selected={isActive} />
              </AvatarWrapper>
            )}
          </NavLink> */}

          <ServersList servers={exploreServers} />
          {!isEmpty(exploreServers) && <Bar />}
          <ServersList servers={servers} />

          <AvatarWrapper>
            <ServerListTooltip title="Add a server" placement="right">
              <StyledAvatar
                onClick={openCreateModal}
                explore="true" // to prevent bool attribute being passed to dom element
                fontSize="1.7rem"
              >
                <Add />
              </StyledAvatar>
            </ServerListTooltip>
          </AvatarWrapper>

          <NavLink to="/guild-discovery">
            {({ isActive }) => (
              <AvatarWrapper>
                <ServerListTooltip title="Explore Public servers" placement="right">
                  <StyledAvatar
                    explore="true" // to prevent bool attribute being passed to dom element
                    selected={isActive}
                    fontSize="1.7rem"
                  >
                    <Explore />
                  </StyledAvatar>
                </ServerListTooltip>
                <VerticalBar selected={isActive} />
              </AvatarWrapper>
            )}
          </NavLink>
        </ServerIconList>
        {!isDiscoveryPage && <ChannelList />}
      </SidebarContainer>
    </>
  );
};

AllServersDrawer.propTypes = {
  isDiscoveryPage: PropTypes.bool.isRequired,
  openCreateModal: PropTypes.func.isRequired,
};

export default AllServersDrawer;
