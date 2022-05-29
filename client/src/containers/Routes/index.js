import { lazy } from 'react';
// import PropTypes from 'prop-types';
import {
  Navigate, Route, Routes,
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
import withSuspense from '../../hocs/withSuspense';

function lazyWithReload(factory) {
  const Component = lazy(factory);
  Component.reload = factory;
  return Component;
}

// lazy loading Inner code extensive components
const LazyLoadingServers = lazyWithReload(() => import('../Servers'));
const LazyLoadingServer = lazyWithReload(() => import('../../components/Server'));
const LazyLoadingChannel = lazyWithReload(() => import('../../components/Channel'));
const LazyLoadingServerDiscovery = lazyWithReload(() => import('../../components/ServerDiscovery'));

const Server = withSuspense(LazyLoadingServer, <ServerLoader />, LazyLoadingServer.reload);
const Channel = withSuspense(LazyLoadingChannel, <ChatLoader />, LazyLoadingChannel.reload);
const ServerDiscovery = withSuspense(
  LazyLoadingServerDiscovery, <ServerDiscoveryLoader />, LazyLoadingServerDiscovery.reload,
);

const DiscoveryServersContainer = withSuspense(
  LazyLoadingServers, <ServerDiscoveryFallback />, LazyLoadingServers.reload,
);

const ChannelsServersContainer = withSuspense(
  LazyLoadingServers, <ServersFallback />, LazyLoadingServers.reload,
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
          <DiscoveryServersContainer />
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
          <ChannelsServersContainer />
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
