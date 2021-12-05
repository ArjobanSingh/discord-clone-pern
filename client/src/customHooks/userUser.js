import { useSelector } from 'react-redux';

const useUser = () => {
  const { user, isLoading, error } = useSelector((state) => state.user);
  return { user, isLoading, error };
};

export default useUser;
