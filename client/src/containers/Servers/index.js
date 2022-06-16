import { useCallback, useMemo, useState } from 'react';
// import PropTypes from 'prop-types';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
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
import CreateServerOptionsScreen from '../../components/CreateServerOptionsScreen';
import UserSettingsProvider from '../../providers/UserSettingsProvider';

const CREATE_SERVER_OPTIONS_SCREEN = 'CREATE_SERVER_OPTIONS_SCREEN';
const CREATE_SERVER_MAIN_SCREEN = 'CREATE_SERVER_MAIN_SCREEN';
// This wrapper will be used for two global routes /channels/ and /guild-discovery
const Servers = () => {
  const { user, isLoading } = useUser();
  const location = useLocation();
  const dispatch = useDispatch();
  const { serverId } = useParams();

  const isDiscoveryPage = location.pathname?.includes('guild-discovery');

  const {
    mobileOpen,
    openDrawer,
    closeDrawer,
  } = useMobileDrawerState();

  const [createServerModalData, setCreateServerModalData] = useState(null);

  const openCreateModal = useCallback(() => {
    setCreateServerModalData(CREATE_SERVER_OPTIONS_SCREEN);
  }, []);

  const openServerModalMainScreen = () => {
    setCreateServerModalData(CREATE_SERVER_MAIN_SCREEN);
  };

  const openServerModalOptionsScreen = () => {
    setCreateServerModalData(CREATE_SERVER_OPTIONS_SCREEN);
  };

  const closeCreateModal = useCallback(() => {
    setCreateServerModalData(null);
  }, []);

  const outletContextValue = useMemo(() => ({
    openCreateModal,
    closeCreateModal,
    openDrawer,
  }), [openCreateModal, closeCreateModal, openDrawer]);

  useDidUpdate(() => {
    if (!createServerModalData) dispatch(createServerReset());
  }, [createServerModalData]);

  useDidUpdate(() => {
    closeCreateModal();
  }, [serverId]);

  const renderDrawerLoader = () => (isDiscoveryPage
    ? <ServersAvatarLoader /> : <ServersListLoading />);

  const renderContentLoader = () => (isDiscoveryPage
    ? <ServerDiscoveryLoader /> : <ServerLoader />);

  const renderModalContent = () => {
    switch (createServerModalData) {
      case CREATE_SERVER_OPTIONS_SCREEN:
        return (
          <CreateServerOptionsScreen
            closeModal={closeCreateModal}
            openServerModalMainScreen={openServerModalMainScreen}
          />
        );
      case CREATE_SERVER_MAIN_SCREEN:
        return (
          <CreateServerModal
            closeModal={closeCreateModal}
            openServerModalOptionsScreen={openServerModalOptionsScreen}
          />
        );
      default: return null;
    }
  };

  return (
    <UserSettingsProvider>
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
              />
            )}
        </ResponsiveDrawer>
        {isLoading || !user
          ? renderContentLoader()
          : <ServerContainer><Outlet context={outletContextValue} /></ServerContainer>}
      </Box>
      <TransitionModal
        open={!!createServerModalData}
        onClose={closeCreateModal}
        aria-labelledby="create-server-title"
        aria-describedby="create-server-description"
        disableAutoFocus={false}
      >
        <div>
          {renderModalContent()}
        </div>
      </TransitionModal>
    </UserSettingsProvider>
  );
};

Servers.propTypes = {

};

export default Servers;
