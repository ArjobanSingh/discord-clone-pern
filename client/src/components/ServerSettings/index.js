import React from 'react';
import PropTypes from 'prop-types';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import {
  ListContainer, MainContent, ServerOptionsDrawer, SettingsContainer, SettingsNav,
} from './styles';
import useMobileDrawerState from '../../customHooks/useMobileDrawerState';
import ServerOptions from '../ServerOptions';

const ServerSettings = (props) => {
  const { closeServerSettings } = props;
  const {
    mobileOpen,
    openDrawer,
    closeDrawer,
  } = useMobileDrawerState();

  return (
    <>
      <ServerOptionsDrawer
        open={mobileOpen}
        onClose={closeDrawer}
      >
        <SettingsNav>
          <ServerOptions />
        </SettingsNav>
      </ServerOptionsDrawer>

      <SettingsContainer>
        <ListContainer>
          <SettingsNav>
            <ServerOptions />
          </SettingsNav>
        </ListContainer>
        <MainContent>
          some main content
        </MainContent>

        <IconButton
          color="inherit"
          aria-label="open/close server options"
          size="small"
          onClick={openDrawer}
          sx={{
            display: { xs: 'bock', md: 'none' },
            position: 'absolute',
            left: '0',
            color: 'text.secondaryDark',
            border: '1px solid currentColor',
          }}
        >
          <MenuIcon />
        </IconButton>

        <IconButton
          color="inherit"
          aria-label="close server settings"
          size="small"
          onClick={closeServerSettings}
          sx={{
            position: 'absolute',
            right: '0',
            color: 'text.secondaryDark',
            border: '1px solid currentColor',
          }}
        >
          <CloseIcon />
        </IconButton>
      </SettingsContainer>
    </>
  );
};

ServerSettings.propTypes = {
  closeServerSettings: PropTypes.func.isRequired,
};

export default ServerSettings;
