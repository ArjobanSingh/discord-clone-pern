import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, Navigate } from 'react-router-dom';
import useIsAuthenticated from '../../customHooks/useIsAuthenticated';
import useUser from '../../customHooks/useUser';
import { userRequested } from '../../redux/actions/user';

const RequireAuth = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user, isLoading, error } = useUser();

  // this will automatically handle fetching user data, if logged in
  useEffect(() => {
    const shouldMakeApiRequest = !user && !isLoading && !error;
    if (isAuthenticated && shouldMakeApiRequest) {
      dispatch(userRequested());
    }
  }, [isAuthenticated, user, isLoading, error]);

  return isAuthenticated
    ? children
    : <Navigate to="/login" state={{ from: location }} />;
};

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RequireAuth;
