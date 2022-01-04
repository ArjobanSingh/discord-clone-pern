import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import ResponsiveDrawer from '../../common/ResponsiveDrawer';
import useUser from '../../customHooks/userUser';
import { userRequested } from '../../redux/actions/user';
import useMobileDrawerState from '../../customHooks/useMobileDrawerState';
import AllServersDrawer from '../../components/AllServersDrawer';

const Servers = (props) => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useUser();

  const [mobileOpen, handleMobileDrawerToggle] = useMobileDrawerState();

  useEffect(() => {
    if (!user) dispatch(userRequested());
  }, []);

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
      >
        {isLoading || !user ? <div>Servers Drawer Loading Ui..</div> : <AllServersDrawer />}
      </ResponsiveDrawer>
      {isLoading || !user ? <div>Children Outlet Loading Ui..</div> : <Outlet />}
    </Box>
  );
};

Servers.propTypes = {

};

export default Servers;
