import { useEffect, useLayoutEffect, useRef } from 'react';

const useDidUpdate = (callback, deps, useUseEffect = true) => {
  const firstUpdate = useRef(true);

  const useEffectHook = useUseEffect ? useEffect : useLayoutEffect;

  useEffectHook(() => {
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
