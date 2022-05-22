import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Route, Routes } from 'react-router-dom';
import RequireAuth from '../containers/RequireAuth';
import ServerDiscovery from '../components/ServerDiscovery';
import Servers from '../containers/Servers';

const ServerDiscoveryPage = (props) => (
  <Routes>
    <Route
      path="/"
      element={(
        <RequireAuth>
          <Servers />
        </RequireAuth>
    )}
    >
      <Route index element={<ServerDiscovery />} />
      <Route path="*" element={<Navigate replace to="" />} />
    </Route>
    {/* <Route path="*" element={<Navigate replace to="/" />} /> */}
  </Routes>
);

ServerDiscoveryPage.propTypes = {

};

export default ServerDiscoveryPage;
