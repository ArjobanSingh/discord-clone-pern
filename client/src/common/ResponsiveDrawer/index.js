import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

const ResponsiveDrawer = (props) => {
  const {
    drawerWidth,
    children,
    mobileOpen,
    closeDrawer,
    boxProps,
    wideScreenDrawerProps,
    ...rest
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
        onClose={closeDrawer}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
        {...rest}
      >
        {children}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
        open
        {...rest}
        {...wideScreenDrawerProps}
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
  closeDrawer: PropTypes.func.isRequired,
  boxProps: PropTypes.shape({}),
  wideScreenDrawerProps: PropTypes.shape({}),
};

ResponsiveDrawer.defaultProps = {
  drawerWidth: 300,
  boxProps: {},
  wideScreenDrawerProps: {},
};

export default ResponsiveDrawer;
