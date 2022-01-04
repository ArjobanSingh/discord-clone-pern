import { Suspense } from 'react';
import PropTypes from 'prop-types';
import { Navigate, Route, Routes } from 'react-router-dom';
import RequireAuth from '../RequireAuth';
import Servers from '../Servers';
import Server from '../../components/Server';
import Channel from '../../components/Channel';
import NoServer from '../../components/NoServer';
import Auth from '../../components/Auth';

// const Auth = lazy(() => import('./components/Auth'));

const AppRoutes = (props) => (
  <Suspense fallback={<div>Loader...</div>}>
    <Routes>
      <Route
        path="/login"
        element={<Auth />}
      />
      <Route
        path="channels"
        element={(
          <RequireAuth>
            <Servers />
          </RequireAuth>
        )}
      >
        <Route path=":serverId" element={<Server />}>
          <Route path=":channelId" element={<Channel />} />
        </Route>
        <Route index element={<NoServer />} />
      </Route>
      <Route path="*" element={<Navigate replace to="/channels/" />} />
    </Routes>
  </Suspense>
);

AppRoutes.propTypes = {

};

export default AppRoutes;
