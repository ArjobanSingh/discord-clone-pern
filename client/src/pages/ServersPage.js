import React from 'react';
import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router-dom';
import RequireAuth from '../containers/RequireAuth';
import Servers from '../containers/Servers';
import Server from '../components/Server';
import Channel from '../components/Channel';

const ServersPage = (props) => {
  const {} = props;
  return (
    <Routes>
      <Route
        path="/"
        element={(
          <RequireAuth>
            <Servers />
          </RequireAuth>
      )}
      >
        {/* <Route path="@me" element={<MeServer />} /> */}
        <Route path=":serverId" element={<Server />}>
          <Route path=":channelId" element={<Channel />} />
        </Route>
        {/* <Route index element={<Navigate replace to="@me" />} /> */}
      </Route>
    </Routes>
  );
};

ServersPage.propTypes = {

};

export default ServersPage;
