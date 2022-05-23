import { lazy, Suspense } from 'react';
// import PropTypes from 'prop-types';
import { Navigate, Route, Routes } from 'react-router-dom';
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

const withSuspense = (Component, Fallback) => (props) => (
  <Suspense fallback={Fallback}>
    <Component {...props} />
  </Suspense>
);

const Servers = lazy(() => import('../Servers'));

const LazyLoadingServer = lazy(() => import('../../components/Server'));
const LazyLoadingChannel = lazy(() => import('../../components/Channel'));
const LazyLoadingServerDiscovery = lazy(() => import('../../components/ServerDiscovery'));

const Server = withSuspense(LazyLoadingServer, <ServerLoader />);
const Channel = withSuspense(LazyLoadingChannel, <ChatLoader />);
const ServerDiscovery = withSuspense(LazyLoadingServerDiscovery, <ServerDiscoveryLoader />);

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
