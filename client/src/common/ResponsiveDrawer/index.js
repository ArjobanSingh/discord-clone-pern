import { useState } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';

const ResponsiveDrawer = (props) => {
  const {
    DraweOpenIcon = <MenuIcon />, drawerWidth, children, ...rest
  } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };
  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open server list drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ mr: 2, display: { sm: 'none' } }}
      >
        {DraweOpenIcon}
      </IconButton>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="all servers"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          {...rest}
        >
          {children}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
          {...rest}
        >
          {children}
        </Drawer>
      </Box>
    </>
  );
};

ResponsiveDrawer.propTypes = {
  DraweOpenIcon: PropTypes.node,
  children: PropTypes.node.isRequired,
  drawerWidth: PropTypes.number,
};

ResponsiveDrawer.defaultProps = {
  drawerWidth: 300,
  DraweOpenIcon: undefined,
};

export default ResponsiveDrawer;
