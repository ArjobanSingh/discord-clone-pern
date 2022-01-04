import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

const ResponsiveDrawer = (props) => {
  const {
    drawerWidth, children, mobileOpen, handleMobileDrawerToggle, boxProps, ...rest
  } = props;

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      {...boxProps}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleMobileDrawerToggle}
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
          backgroundColor: 'background.paper',
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
        {...rest}
      >
        {children}
      </Drawer>
    </Box>
  );
};

ResponsiveDrawer.propTypes = {
  children: PropTypes.node.isRequired,
  drawerWidth: PropTypes.number,
  mobileOpen: PropTypes.bool.isRequired,
  handleMobileDrawerToggle: PropTypes.func.isRequired,
  boxProps: PropTypes.shape({}),
};

ResponsiveDrawer.defaultProps = {
  drawerWidth: 300,
  boxProps: {},
};

export default ResponsiveDrawer;
