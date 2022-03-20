import { useCallback, useRef } from 'react';

const useIntersectionObserver = (shouldObserve, callback) => {
  const observer = useRef();
  const elementRef = useRef();

  const elementRefCallback = useCallback((node) => {
    if (observer.current) observer.current.disconnect();
    elementRef.current = node;

    if (shouldObserve) {
      observer.current = new IntersectionObserver((entries) => {
        const [observedEntry] = entries;
        callback(observedEntry);
      });

      if (node) observer.current.observe(node);
    }
  }, [callback, shouldObserve]);

  return [elementRefCallback, elementRef];
};

export default useIntersectionObserver;
