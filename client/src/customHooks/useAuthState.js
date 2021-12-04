import { useState } from 'react';
import { useSelector } from 'react-redux';
import { isEmpty } from '../utils/validators';
import useDidUpdate from './useDidUpdate';

const useAuthState = (selector) => {
  const { isLoading, error: apiErrors } = useSelector(selector);
  const [errors, setErrors] = useState({});

  useDidUpdate(() => {
    if (!isEmpty(apiErrors)) setErrors(apiErrors);
  }, [apiErrors]);

  return { isLoading, errors, setErrors };
};

export default useAuthState;
