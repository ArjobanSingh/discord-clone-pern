import PropTypes from 'prop-types';
import {
  NavLink, useParams,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import {
  AvatarWrapper,
  Bar,
  ServerListTooltip,
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
import Add from '../../common/AddIcon';
import TransitionModal from '../../common/TransitionModal';
import CreateServerModal from '../CreateServerModal';
import useDidUpdate from '../../customHooks/useDidUpdate';

const AllServersDrawer = ({ isDiscoveryPage }) => {
  const servers = useSelector(getAllServers);
  const exploreServers = useSelector(getAllExploreServersData);

  const { serverId } = useParams();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  useDidUpdate(() => {
    closeCreateModal();
  }, [serverId]);

  return (
    <>
      <SidebarContainer>
        <ServerIconList>
          <NavLink to="/channels/@me">
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
          </NavLink>

          <ServersList servers={exploreServers} />
          <Bar />
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
      <TransitionModal
        open={isCreateModalOpen}
        onClose={closeCreateModal}
        aria-labelledby="create-server-title"
        aria-describedby="create-server-description"
        disableAutoFocus={false}
      >
        <div>
          <CreateServerModal
            closeModal={closeCreateModal}
          />
        </div>
      </TransitionModal>
    </>
  );
};

AllServersDrawer.propTypes = {
  isDiscoveryPage: PropTypes.bool.isRequired,
};

export default AllServersDrawer;
