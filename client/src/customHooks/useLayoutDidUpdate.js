import { useLayoutEffect, useRef } from 'react';

const useLayoutDidUpdate = (callback, deps) => {
  const firstUpdate = useRef(true);

  useLayoutEffect(() => {
    let returnFunc;
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return returnFunc;
    }
    returnFunc = callback();
    return returnFunc;
  }, deps);
};

export default useLayoutDidUpdate;
