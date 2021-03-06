import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  AbsoluteIconsContainer,
  FullHeightContainer,
  ListContainer,
  MainContent,
  ServerOptionsDrawer,
  SettingsContainer,
  SettingsDrawerMenuIcon,
  SettingsNav,
} from './styles';
import useMobileDrawerState from '../../customHooks/useMobileDrawerState';
import ServerOptions from './ServerOptions';
import { ServerMemberRoles, SERVER_SETTINGS } from '../../constants/servers';
import OptionContent from './OptionContent';
import SnackbarProvider from './SnackbarProvider';
import ConfirmationModal from '../../common/ConfirmationModal';
import useServerData from '../../customHooks/useServerData';
import { deleteServerRequested } from '../../redux/actions/servers';

const ServerSettings = (props) => {
  const { closeServerSettings, currentRole } = props;
  const { serverId } = useParams();
  const { serverDetails } = useServerData(serverId, false);
  const dispatch = useDispatch();

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

  const onDeleteServer = () => {
    dispatch(deleteServerRequested(serverId));
  };

  const openNewOption = (newTabOption) => {
    if (newTabOption) {
      setOpenedTab(newTabOption);
    } else {
      // if newTabOption not available means action type button
      // for now only delete server modal action
      openDeleteModal();
    }
    closeDrawer();
  };

  return (
    <SnackbarProvider value={snackbarValue}>
      <ServerOptionsDrawer
        open={mobileOpen}
        onClose={closeDrawer}
      >
        <SettingsNav>
          <ServerOptions
            openedTab={openedTab}
            currentRole={currentRole}
            openNewOption={openNewOption}
          />
        </SettingsNav>
      </ServerOptionsDrawer>

      <FullHeightContainer>
        <SettingsContainer>
          <ListContainer>
            <SettingsNav>
              <ServerOptions
                openedTab={openedTab}
                currentRole={currentRole}
                openNewOption={openNewOption}
              />
            </SettingsNav>
          </ListContainer>
          <MainContent>
            <OptionContent
              openedTab={openedTab}
            />
          </MainContent>

          <AbsoluteIconsContainer>
            <SettingsDrawerMenuIcon
              aria-label="open/close server options"
              size="small"
              onClick={openDrawer}
              color="inherit"
            >
              <MenuIcon />
            </SettingsDrawerMenuIcon>

            <IconButton
              color="inherit"
              aria-label="close server settings"
              size="small"
              onClick={closeServerSettings}
            >
              <CloseIcon />
            </IconButton>
          </AbsoluteIconsContainer>
        </SettingsContainer>
      </FullHeightContainer>

      {currentRole === ServerMemberRoles.OWNER && (
        <ConfirmationModal
          open={isDeleteModalVisible}
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
