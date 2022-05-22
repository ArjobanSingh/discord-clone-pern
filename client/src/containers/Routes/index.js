import { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router-dom';
import RequireAuth from '../RequireAuth';
// import MeServer from '../../components/MeServer';
import Auth from '../../components/Auth';
import InvitePage from '../InvitePage';
import RouteNavigator from '../RouteNavigator';
import ServersFallback from './ServersFallback';

const ServersPage = lazy(() => import('../../pages/ServersPage'));
const ServerDiscoveryPage = lazy(() => import('../../pages/ServerDiscoveryPage'));

const AppRoutes = (props) => (
  <Routes>
    <Route
      path="/login"
      element={<Auth />}
    />
    <Route
      path="/guild-discovery/*"
      element={(
        <Suspense fallback={<div>All Server guild loading</div>}>
          <ServerDiscoveryPage />
        </Suspense>
      )}
    />

    <Route
      path="/channels/*"
      element={(
        <Suspense fallback={<ServersFallback />}>
          <ServersPage />
        </Suspense>
      )}
    />

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
