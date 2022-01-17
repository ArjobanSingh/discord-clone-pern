import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userRequested } from '../redux/actions/user';
import { getUser } from '../redux/reducers';
import useIsAuthenticated from './useIsAuthenticated';

const useUser = () => {
  const { user, isLoading, error } = useSelector((state) => getUser(state));
  const isAuthenticated = useIsAuthenticated();

  const dispatch = useDispatch();

  useEffect(() => {
    const shouldMakeApiRequest = !user && !isLoading && !error;
    if (isAuthenticated && shouldMakeApiRequest) {
      dispatch(userRequested());
    }
  }, [isAuthenticated, user, isLoading, error]);

  const retryUser = () => {
    dispatch(userRequested());
  };

  return {
    user, isLoading, error, retryUser,
  };
};

export default useUser;
