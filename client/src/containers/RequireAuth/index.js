import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, Navigate } from 'react-router-dom';
import ApiError from '../../common/ApiError';
import useIsAuthenticated from '../../customHooks/useIsAuthenticated';
import useUser from '../../customHooks/useUser';
import { userRequested } from '../../redux/actions/user';

const RequireAuth = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user, isLoading, error } = useUser();

  const getUserData = () => dispatch(userRequested());

  // this will automatically handle fetching user data, if logged in
  useEffect(() => {
    const shouldMakeApiRequest = !user && !isLoading && !error;
    if (isAuthenticated && shouldMakeApiRequest) {
      getUserData();
    }
  }, [isAuthenticated, user, isLoading, error]);

  if (error) {
    return (
      <ApiError
        error={error.message}
        errorDescription="Not able to get user details, Please try again later"
        retry={getUserData}
      />
    );
  }

  return isAuthenticated
    ? children
    : <Navigate to="/login" state={{ from: location }} replace />;
};

RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RequireAuth;
