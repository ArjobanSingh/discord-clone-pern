import PropTypes from 'prop-types';
import { Outlet, useLocation } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import ResponsiveDrawer from '../../common/ResponsiveDrawer';
import useUser from '../../customHooks/useUser';
import useMobileDrawerState from '../../customHooks/useMobileDrawerState';
import AllServersDrawer from '../../components/AllServersDrawer';

// This wrapper will be used for two global routes /channels/ and /guild-discovery
const Servers = () => {
  const { user, isLoading, error } = useUser();
  const location = useLocation();

  const isDiscoveryPage = location.pathname?.includes('guild-discovery');

  const [mobileOpen, handleMobileDrawerToggle] = useMobileDrawerState();

  if (error) return error.message;

  return (
    <Box
      display="flex"
      width="100%"
      height="100%"
    >
      <IconButton
        color="inherit"
        aria-label="open server list drawer"
        edge="start"
        onClick={handleMobileDrawerToggle}
        sx={{
          margin: 'auto', display: { sm: 'none' }, position: 'fixed',
        }}
      >
        <MenuIcon />
      </IconButton>
      <ResponsiveDrawer
        mobileOpen={mobileOpen}
        handleMobileDrawerToggle={handleMobileDrawerToggle}
        boxProps={{ 'aria-label': 'all servers' }}
        drawerWidth={isDiscoveryPage ? 74 : undefined}
      >
        {isLoading || !user
          ? <div>Servers Drawer Loading Ui..</div>
          : <AllServersDrawer isDiscoveryPage={isDiscoveryPage} />}
      </ResponsiveDrawer>
      {isLoading || !user ? <div>Children Outlet Loading Ui..</div> : <Outlet />}
    </Box>
  );
};

Servers.propTypes = {

};

export default Servers;
