import { lazy, Suspense, useState } from 'react';
// import PropTypes from 'prop-types';
import {
  Navigate, Route, Routes, useLocation, useNavigate,
} from 'react-router-dom';
import RequireAuth from '../RequireAuth';
// import MeServer from '../../components/MeServer';
import Auth from '../../components/Auth';
import InvitePage from '../InvitePage';
import RouteNavigator from '../RouteNavigator';

import ServerLoader from '../../components/Server/ServerLoader';
import ServerDiscoveryLoader from '../../components/ServerDiscovery/ServerDiscoveryLoader';
import ServersFallback from './ServersFallback';
import ServerDiscoveryFallback from './ServerDiscoveryFallback';
import ChatLoader from '../../components/Chat/ChatLoader';
import RouteErrorBoundary from '../RouteErrorBoundary';

// reloadChunk={reloadChunk}
// navigate={navigate}
// fallback={Fallback}
// location={location}
// hoc to wrap every lazy loading component with Suspense and fallback
const withSuspense = (c, Fallback, reloadChunk) => (props) => {
  const [Component, setComponent] = useState(c);
  const navigate = useNavigate();
  const location = useLocation();

  const reload = async () => {
    try {
      const res = await reloadChunk();
      setComponent(res);
    } catch (err) {
      // reloading error:
      console.log('reloading error', err);
    }
  };
  return (
    <RouteErrorBoundary>
      <Suspense fallback={Fallback}>
        <Component {...props} />
      </Suspense>
    </RouteErrorBoundary>
  );
};

function lazyWithPreload(factory) {
  const Component = lazy(factory);
  Component.preload = factory;
  return Component;
}

// lazy loading Inner code extensive components
const Servers = lazyWithPreload(() => import('../Servers'));
const LazyLoadingServer = lazyWithPreload(() => import('../../components/Server'));
const LazyLoadingChannel = lazyWithPreload(() => import('../../components/Channel'));
const LazyLoadingServerDiscovery = lazyWithPreload(() => import('../../components/ServerDiscovery'));

const Server = withSuspense(LazyLoadingServer, <ServerLoader />, LazyLoadingServer.preload);
const Channel = withSuspense(LazyLoadingChannel, <ChatLoader />, LazyLoadingChannel.preload);
const ServerDiscovery = withSuspense(
  LazyLoadingServerDiscovery, <ServerDiscoveryLoader />, LazyLoadingServerDiscovery.preload,
);

const AppRoutes = () => (
  <Routes>
    <Route
      path="/login"
      element={<Auth />}
    />

    <Route
      path="/guild-discovery"
      element={(
        <RequireAuth>
          <Suspense fallback={<ServerDiscoveryFallback />}>
            <Servers />
          </Suspense>
        </RequireAuth>
      )}
    >
      <Route index element={<ServerDiscovery />} />
      <Route path="*" element={<Navigate replace to="/guild-discovery" />} />
    </Route>

    <Route
      path="channels"
      element={(
        <RequireAuth>
          <Suspense fallback={<ServersFallback />}>
            <Servers />
          </Suspense>
        </RequireAuth>
        )}
    >
      {/* <Route path="@me" element={<MeServer />} /> */}
      <Route path=":serverId" element={<Server />}>
        <Route path=":channelId" element={<Channel />} />
      </Route>
      {/* <Route index element={<Navigate replace to="@me" />} /> */}
    </Route>

    <Route
      path="/invite/:inviteId"
      element={(
        <RequireAuth>
          <InvitePage />
        </RequireAuth>
      )}
    />
    {/* <Route path="*" element={<Navigate replace to="/channels/@me" />} /> */}
    <Route path="*" element={<RequireAuth><RouteNavigator /></RequireAuth>} />
  </Routes>
);

AppRoutes.propTypes = {

};

export default AppRoutes;
