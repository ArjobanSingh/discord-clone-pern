import {
  useCallback, useRef, useEffect, useState,
} from 'react';

// const listenerCallbacks = new WeakMap();

// let rootObserver;

// function handleIntersections(entries) {
//   entries.forEach((entry) => {
//     console.log('Target intersecting', entry.target);
//     const callback = listenerCallbacks.get(entry.target);
//     if (callback && entry.isIntersecting) {
//       rootObserver.unobserve(entry.target);
//       listenerCallbacks.delete(entry.target);
//       if (typeof callback === 'function') callback();
//     }
//   });
// }

// function getIntersectionObserver() {
//   if (rootObserver === undefined) {
//     rootObserver = new IntersectionObserver(handleIntersections, {
//       rootMargin: '100px',
//       root: document.getElementById('messages-container'),
//     });
//   }
//   return rootObserver;
// }

// for now server single purpose for image messages
const useLazyLoad = () => {
  const elementRef = useRef();
  const [isIntersecting, setIsIntersecting] = useState(false);

  const observer = useRef(new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        observer.current.unobserve(entry.target);
        setIsIntersecting(true);
      }
    });
  }));

  useEffect(() => {
    if (isIntersecting) {
      observer.current = null;
    }
  }, [isIntersecting]);

  useEffect(() => () => {
    if (!elementRef.current || !observer.current) return;
    // listenerCallbacks.delete(elementRef.current);
    observer.current.unobserve?.(elementRef.current);
  }, []);

  const elementRefCallback = useCallback((node) => {
    if (!node) return;
    elementRef.current = node;
    const target = node;
    // const observer = getIntersectionObserver();
    // listenerCallbacks.set(target, () => { setIsIntersecting(true); });
    observer.current?.observe?.(target);
  }, []);

  return {
    setRef: elementRefCallback,
    isIntersecting,
    elementRef,
  };
};

export default useLazyLoad;
