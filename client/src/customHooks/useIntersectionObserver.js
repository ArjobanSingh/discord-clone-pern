import { useCallback, useRef, useEffect } from 'react';

const listenerCallbacks = new WeakMap();

let rootObserver;

function handleIntersections(entries) {
  entries.forEach((entry) => {
    if (listenerCallbacks.has(entry.target)) {
      const callback = listenerCallbacks.get(entry.target);
      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        rootObserver.unobserve(entry.target);
        listenerCallbacks.delete(entry.target);
        if (typeof callback === 'function') callback(entry.target);
      }
    }
  });
}

function getIntersectionObserver() {
  if (rootObserver === undefined) {
    rootObserver = new IntersectionObserver(handleIntersections, {
      rootMargin: '100px',
      root: document.getElementById('messages-container'),
    });
  }
  return rootObserver;
}

const useIntersectionObserver = (callback) => {
  const elementRef = useRef();

  useEffect(() => () => {
    listenerCallbacks.delete(elementRef.current);
    rootObserver.unobserve(elementRef.current);
  }, []);

  const elementRefCallback = useCallback((node) => {
    if (!node) return;
    elementRef.current = node;
    const target = node;
    const observer = getIntersectionObserver();
    listenerCallbacks.set(target, callback);
    observer.observe(target);
  }, [callback]);

  return [elementRefCallback, elementRef];
};

export default useIntersectionObserver;
