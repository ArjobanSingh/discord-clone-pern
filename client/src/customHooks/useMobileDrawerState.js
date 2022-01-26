import { useCallback, useState } from 'react';

const useMobileDrawerState = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const openDrawer = useCallback(() => {
    setMobileOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return {
    mobileOpen,
    openDrawer,
    closeDrawer,
  };
};

export default useMobileDrawerState;
