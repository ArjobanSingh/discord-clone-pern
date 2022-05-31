import React from 'react';
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

const UserSettings = (props) => {
  const { closeUserSettingsDialog } = props;

  const {
    mobileOpen,
    openDrawer,
    closeDrawer,
  } = useMobileDrawerState();

  return (
    <Container>
      <UserOptionsDrawer
        open={mobileOpen}
        onClose={closeDrawer}
      >
        <SettingsNav>
          <div>options</div>
        </SettingsNav>
      </UserOptionsDrawer>

      <FullHeightContainer>
        <UserSettingsContainer>
          <ListContainer>
            <SettingsNav>
              options nav
            </SettingsNav>
          </ListContainer>

          <MainContent>
            main content
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
