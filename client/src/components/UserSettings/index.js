import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { Container } from './styled';
import {
  AbsoluteIconsContainer,
  FullHeightContainer,
  ListContainer,
  MainContent,
  ServerOptionsDrawer as UserOptionsDrawer,
  SettingsContainer as UserSettingsContainer,
  SettingsDrawerMenuIcon as UserSettingsDrawerMenuIcon,
  SettingsNav,
} from '../ServerSettings/styles';
import useMobileDrawerState from '../../customHooks/useMobileDrawerState';
import UserSettingsOptions from './UserSettingsOptions';
import { USER_SETTINGS } from '../../constants/user';
import OptionContent from './OptionContent';

const UserSettings = (props) => {
  const { closeUserSettingsDialog } = props;

  const {
    mobileOpen,
    openDrawer,
    closeDrawer,
  } = useMobileDrawerState();

  const [openedTab, setOpenedTab] = useState(USER_SETTINGS.MY_ACCOUNT);

  const openLogoutModal = () => {};

  const openNewOption = (newTabOption) => {
    if (newTabOption) {
      setOpenedTab(newTabOption);
    } else {
      // if newTabOption not available means action type button
      // for now only logout modal action
      openLogoutModal();
    }
    closeDrawer();
  };

  return (
    <Container>
      <UserOptionsDrawer
        open={mobileOpen}
        onClose={closeDrawer}
      >
        <SettingsNav>
          <UserSettingsOptions
            openedTab={openedTab}
            openNewOption={openNewOption}
          />
        </SettingsNav>
      </UserOptionsDrawer>

      <FullHeightContainer>
        <UserSettingsContainer>
          <ListContainer>
            <SettingsNav>
              <UserSettingsOptions
                openedTab={openedTab}
                openNewOption={openNewOption}
              />
            </SettingsNav>
          </ListContainer>

          <MainContent>
            <OptionContent openedTab={openedTab} />
          </MainContent>

          <AbsoluteIconsContainer>
            <UserSettingsDrawerMenuIcon
              aria-label="open/close server options"
              size="small"
              onClick={openDrawer}
              color="inherit"
            >
              <MenuIcon />
            </UserSettingsDrawerMenuIcon>

            <IconButton
              color="inherit"
              aria-label="close server settings"
              size="small"
              onClick={closeUserSettingsDialog}
            >
              <CloseIcon />
            </IconButton>
          </AbsoluteIconsContainer>
        </UserSettingsContainer>
      </FullHeightContainer>
    </Container>
  );
};

UserSettings.propTypes = {
  closeUserSettingsDialog: PropTypes.func.isRequired,
};

export default UserSettings;
