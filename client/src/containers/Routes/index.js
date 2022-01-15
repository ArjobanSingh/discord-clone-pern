import { Suspense } from 'react';
import PropTypes from 'prop-types';
import { Navigate, Route, Routes } from 'react-router-dom';
import RequireAuth from '../RequireAuth';
import Servers from '../Servers';
import Server from '../../components/Server';
import Channel from '../../components/Channel';
import MeServer from '../../components/MeServer';
import Auth from '../../components/Auth';
import InvitePage from '../InvitePage';

// const Auth = lazy(() => import('./components/Auth'));

const AppRoutes = (props) => (
  <Suspense fallback={<div>Loader...</div>}>
    <Routes>
      <Route
        path="/login"
        element={<Auth />}
      />
      <Route
        path="/invite/:inviteId"
        element={(
          <RequireAuth>
            <InvitePage />
          </RequireAuth>
      )}
      />
      <Route
        path="channels"
        element={(
          <RequireAuth>
            <Servers />
          </RequireAuth>
        )}
      >
        <Route path="@me" element={<MeServer />} />
        <Route path=":serverId" element={<Server />}>
          <Route path=":channelId" element={<Channel />} />
        </Route>
        <Route index element={<Navigate replace to="@me" />} />
      </Route>
      <Route path="*" element={<Navigate replace to="/channels/@me" />} />
    </Routes>
  </Suspense>
);

AppRoutes.propTypes = {

};

export default AppRoutes;
