import { useCallback, useState } from 'react';

const useMobileDrawerState = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleState = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);
  return [mobileOpen, toggleState];
};

export default useMobileDrawerState;
