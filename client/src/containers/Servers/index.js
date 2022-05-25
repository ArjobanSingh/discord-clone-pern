import PropTypes from 'prop-types';
import { Outlet, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import ResponsiveDrawer from '../../common/ResponsiveDrawer';
import useUser from '../../customHooks/useUser';
import useMobileDrawerState from '../../customHooks/useMobileDrawerState';
import AllServersDrawer from '../../components/AllServersDrawer';
import { ServerContainer } from '../../components/Server/styles';
import ServersListLoading, { ServersAvatarLoader } from './ServersListLoading';
import ServerLoader from '../../components/Server/ServerLoader';
import ServerDiscoveryLoader from '../../components/ServerDiscovery/ServerDiscoveryLoader';
import TransitionModal from '../../common/TransitionModal';
import CreateServerModal from '../../components/CreateServerModal';
import useDidUpdate from '../../customHooks/useDidUpdate';
import { createServerReset } from '../../redux/actions/servers';

// This wrapper will be used for two global routes /channels/ and /guild-discovery
const Servers = () => {
  const { user, isLoading } = useUser();
  const location = useLocation();
  const dispatch = useDispatch();

  const isDiscoveryPage = location.pathname?.includes('guild-discovery');

  const {
    mobileOpen,
    openDrawer,
    closeDrawer,
  } = useMobileDrawerState();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const openCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const outletContextValue = useMemo(() => ({
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
    openDrawer,
  }), [isCreateModalOpen, openCreateModal, closeCreateModal, openDrawer]);

  useDidUpdate(() => {
    if (!isCreateModalOpen) dispatch(createServerReset());
  }, [isCreateModalOpen]);

  const renderDrawerLoader = () => (isDiscoveryPage
    ? <ServersAvatarLoader /> : <ServersListLoading />);

  const renderContentLoader = () => (isDiscoveryPage
    ? <ServerDiscoveryLoader /> : <ServerLoader />);

  return (
    <>
      <Box
        display="flex"
        width="100%"
        height="100%"
      >
        <ResponsiveDrawer
          mobileOpen={mobileOpen}
          closeDrawer={closeDrawer}
          boxProps={{ 'aria-label': 'all servers' }}
          drawerWidth={isDiscoveryPage ? 74 : 320}
        >
          {isLoading || !user
            ? renderDrawerLoader()
            : (
              <AllServersDrawer
                isDiscoveryPage={isDiscoveryPage}
                openCreateModal={openCreateModal}
                closeCreateModal={closeCreateModal}
              />
            )}
        </ResponsiveDrawer>
        {isLoading || !user
          ? renderContentLoader()
          : <ServerContainer><Outlet context={outletContextValue} /></ServerContainer>}
      </Box>
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

Servers.propTypes = {

};

export default Servers;
