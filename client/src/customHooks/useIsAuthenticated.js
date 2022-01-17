import { useSelector } from 'react-redux';
import { getIsAuthenticated } from '../redux/reducers';

const useIsAuthenticated = () => {
  const isAuthenticated = useSelector((state) => getIsAuthenticated(state));
  return isAuthenticated;
};

export default useIsAuthenticated;
