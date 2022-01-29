import React from 'react';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import {
  ListContainer, MainContent, SettingsContainer, SettingsNav,
} from './styles';

const ServerSettings = (props) => {
  const { closeServerSettings } = props;
  return (
    <SettingsContainer>
      <ListContainer>
        <SettingsNav>
          list
        </SettingsNav>
      </ListContainer>
      <MainContent>
        some main content
      </MainContent>
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
  );
};

ServerSettings.propTypes = {
  closeServerSettings: PropTypes.func.isRequired,
};

export default ServerSettings;
