import { useEffect, useRef } from 'react';

const useDidUpdate = (callback, deps) => {
  const firstUpdate = useRef(true);

  useEffect(() => {
    let returnFunc;
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return returnFunc;
    }
    returnFunc = callback();
    return returnFunc;
  }, deps);
};

export default useDidUpdate;
