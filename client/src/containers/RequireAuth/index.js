import PropTypes from 'prop-types';
import { useLocation, Navigate } from 'react-router-dom';
import useIsAuthenticated from '../../customHooks/useIsAuthenticated';
import useUser from '../../customHooks/useUser';

const RequireAuth = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();

  // this will automatically handle fetching user data, if logged in
  useUser();

  return isAuthenticated
    ? children
    : <Navigate to="/login" state={{ from: location }} />;
};

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RequireAuth;
