import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useParams } from 'react-router-dom';
import {
  FullHeightContainer,
  ListContainer, MainContent, ServerOptionsDrawer, SettingsContainer, SettingsNav,
} from './styles';
import useMobileDrawerState from '../../customHooks/useMobileDrawerState';
import ServerOptions from './ServerOptions';
import { ServerMemberRoles, SERVER_SETTINGS } from '../../constants/servers';
import OptionContent from './OptionContent';
import SnackbarProvider from './SnackbarProvider';
import ConfirmationModal from '../../common/ConfirmationModal';
import useServerData from '../../customHooks/useServerData';

const ServerSettings = (props) => {
  const { closeServerSettings, currentRole } = props;
  const { serverId } = useParams();
  const { serverDetails } = useServerData(serverId, false);

  const {
    mobileOpen,
    openDrawer,
    closeDrawer,
  } = useMobileDrawerState();

  const [openedTab, setOpenedTab] = useState(SERVER_SETTINGS.OVERVIEW);
  const [reset, setReset] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const snackbarValue = useMemo(() => ({
    isSnackbarOpen,
    reset,
    setIsSnackbarOpen,
    setReset,
  }), [isSnackbarOpen, reset]);

  const closeDeleteModal = () => {
    setIsDeleteModalVisible(false);
  };

  const openDeleteModal = () => {
    setIsDeleteModalVisible(true);
  };

  const onDeleteServer = () => {};

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
            openDeleteModal={openDeleteModal}
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
                openDeleteModal={openDeleteModal}
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

      {currentRole === ServerMemberRoles.OWNER && (
        <ConfirmationModal
          open={!!isDeleteModalVisible}
          onClose={closeDeleteModal}
          title={`Delete '${serverDetails.name}'`}
          description={(
            <>
              Are you sure want to delete
              {' '}
              <strong>{serverDetails.name}</strong>
              ?
              This action cannot be undone
            </>
          )}
          onConfirm={onDeleteServer}
        />
      )}
    </SnackbarProvider>
  );
};

ServerSettings.propTypes = {
  closeServerSettings: PropTypes.func.isRequired,
  currentRole: PropTypes.oneOf(Object.keys(ServerMemberRoles)).isRequired,
};

export default ServerSettings;
