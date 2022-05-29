import { lazy, Suspense, useState } from 'react';
import RouteErrorBoundary from '../containers/RouteErrorBoundary';

// hoc to wrap every lazy loading component with Suspense and fallback
const withSuspense = (initialComponent, Fallback, factory) => (props) => {
  const [Component, setComponent] = useState(() => initialComponent);

  const reloadChunk = async () => {
    const newComponent = lazy(factory);
    setComponent(newComponent);
  };

  return (
    <RouteErrorBoundary reloadChunk={reloadChunk} fallback={Fallback}>
      <Suspense fallback={Fallback}>
        <Component {...props} />
      </Suspense>
    </RouteErrorBoundary>
  );
};

export default withSuspense;
