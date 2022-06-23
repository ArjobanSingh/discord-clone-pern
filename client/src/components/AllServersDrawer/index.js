import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import {
  AvatarWrapper,
  Bar,
  ServerListTooltip,
  ServerIconList,
  SidebarContainer,
  StyledAvatar,
  VerticalBar,
  UserAvatarWrapper,
} from './styles';
// import Logo from '../../common/Logo';
import ChannelList from '../ChannelList';
import { getAllExploreServersData, getAllServers } from '../../redux/reducers';
import Explore from '../../common/Explore';
import ServersList from './ServersList';
import Add from '../../common/AddIcon';
import { isEmpty } from '../../utils/validators';
import { useUserSettings } from '../../providers/UserSettingsProvider';

const AllServersDrawer = ({
  isDiscoveryPage,
  openCreateModal,
}) => {
  const servers = useSelector(getAllServers);
  const exploreServers = useSelector(getAllExploreServersData);
  const { openUserSettingsDialog } = useUserSettings();

  return (
    <>
      <SidebarContainer position="relative">
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
                explore
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
                    explore
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

          <UserAvatarWrapper>
            <AvatarWrapper>
              <ServerListTooltip title="User settings" placement="right">
                <StyledAvatar
                  onClick={openUserSettingsDialog}
                  explore
                  fontSize="1.7rem"
                >
                  <ManageAccountsIcon />
                </StyledAvatar>
              </ServerListTooltip>
            </AvatarWrapper>
          </UserAvatarWrapper>
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
