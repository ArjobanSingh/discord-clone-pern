import { useSelector } from 'react-redux';

const useIsAuthenticated = () => {
  const isAuthenticated = useSelector((state) => state.auth.main.isAuthenticated);
  return isAuthenticated;
};

export default useIsAuthenticated;
