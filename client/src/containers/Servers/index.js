import PropTypes from 'prop-types';
import { Outlet, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import ResponsiveDrawer from '../../common/ResponsiveDrawer';
import useUser from '../../customHooks/useUser';
import useMobileDrawerState from '../../customHooks/useMobileDrawerState';
import AllServersDrawer from '../../components/AllServersDrawer';
import { ServerContainer } from '../../components/Server/styles';
import ServersListLoading from './ServersListLoading';
import ServerLoader from '../../components/Server/ServerLoader';

// This wrapper will be used for two global routes /channels/ and /guild-discovery
const Servers = () => {
  const { user, isLoading, error } = useUser();
  const location = useLocation();

  const isDiscoveryPage = location.pathname?.includes('guild-discovery');

  const {
    mobileOpen,
    openDrawer,
    closeDrawer,
  } = useMobileDrawerState();

  if (error) return error.message;

  return (
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
          ? <ServersListLoading />
          : <AllServersDrawer isDiscoveryPage={isDiscoveryPage} />}
      </ResponsiveDrawer>
      {isLoading || !user
        ? <ServerLoader />
        : <ServerContainer><Outlet context={openDrawer} /></ServerContainer>}
    </Box>
  );
};

Servers.propTypes = {

};

export default Servers;
