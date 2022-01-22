import { useSelector } from 'react-redux';
import { getUser } from '../redux/reducers';

const useUser = () => {
  const { user, isLoading, error } = useSelector((state) => getUser(state));
  return {
    user, isLoading, error,
  };
};

export default useUser;
