import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import {
  FullHeightContainer,
  ListContainer, MainContent, ServerOptionsDrawer, SettingsContainer, SettingsNav,
} from './styles';
import useMobileDrawerState from '../../customHooks/useMobileDrawerState';
import ServerOptions from './ServerOptions';
import { ServerMemberRoles, SERVER_SETTINGS } from '../../constants/servers';
import OptionContent from './OptionContent';
import SnackbarProvider from './SnackbarProvider';

const ServerSettings = (props) => {
  const { closeServerSettings, currentRole } = props;
  const {
    mobileOpen,
    openDrawer,
    closeDrawer,
  } = useMobileDrawerState();

  const [openedTab, setOpenedTab] = useState(SERVER_SETTINGS.OVERVIEW);
  const [reset, setReset] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const snackbarValue = useMemo(() => ({
    isSnackbarOpen,
    reset,
    setIsSnackbarOpen,
    setReset,
  }), [isSnackbarOpen, reset]);

  return (
    <SnackbarProvider value={snackbarValue}>
      <ServerOptionsDrawer
        open={mobileOpen}
        onClose={closeDrawer}
      >
        <SettingsNav>
          <ServerOptions
            setOpenedTab={setOpenedTab}
            openedTab={openedTab}
            currentRole={currentRole}
          />
        </SettingsNav>
      </ServerOptionsDrawer>

      <FullHeightContainer>
        <SettingsContainer>
          <ListContainer>
            <SettingsNav>
              <ServerOptions
                setOpenedTab={setOpenedTab}
                openedTab={openedTab}
                currentRole={currentRole}
              />
            </SettingsNav>
          </ListContainer>
          <MainContent>
            <OptionContent
              openedTab={openedTab}
            />
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
      </FullHeightContainer>
    </SnackbarProvider>
  );
};

ServerSettings.propTypes = {
  closeServerSettings: PropTypes.func.isRequired,
  currentRole: PropTypes.oneOf(Object.keys(ServerMemberRoles)).isRequired,
};

export default ServerSettings;
