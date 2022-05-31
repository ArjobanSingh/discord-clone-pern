import {
  createContext, useCallback, useContext, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import Zoom from '@mui/material/Zoom';
import UserSettings from '../components/UserSettings';

const UserSettingsContext = createContext({
  openUserSettingsDialog: () => {},
  closeUserSettingsDialog: () => {},
});

export const useUserSettings = () => useContext(UserSettingsContext);

const UserSettingsProvider = ({ children }) => {
  const [isUserSettingsModalOpen, setIsUserSettingsModalOpen] = useState(false);

  const closeUserSettingsDialog = useCallback(() => {
    setIsUserSettingsModalOpen(false);
  }, []);

  const openUserSettingsDialog = useCallback(() => {
    setIsUserSettingsModalOpen(true);
  }, []);

  const contextValue = useMemo(() => ({
    openUserSettingsDialog,
    closeUserSettingsDialog,
  }), [openUserSettingsDialog, closeUserSettingsDialog]);

  return (
    <UserSettingsContext.Provider value={contextValue}>
      {children}
      <Dialog
        fullScreen
        open={isUserSettingsModalOpen}
        onClose={closeUserSettingsDialog}
        TransitionComponent={Zoom}
      >
        <UserSettings closeUserSettingsDialog={closeUserSettingsDialog} />
      </Dialog>
    </UserSettingsContext.Provider>
  );
};

UserSettingsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserSettingsProvider;
