import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userRequested } from '../redux/actions/user';

const useUser = () => {
  const { user, isLoading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user && !isLoading && !error) dispatch(userRequested());
  }, [user, isLoading, error]);

  const retryUser = () => {
    dispatch(userRequested());
  };

  return {
    user, isLoading, error, retryUser,
  };
};

export default useUser;
