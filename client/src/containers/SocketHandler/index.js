import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { io } from 'socket.io-client';
import useIsAuthenticated from '../../customHooks/useIsAuthenticated';
import SocketClientProvider from './SocketClientProvider';

const SocketHandler = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();

  const [socketClient, setSocketClient] = useState(() => io('http://localhost:5000'));

  useEffect(() => {
    if (isAuthenticated) {
      socketClient.connect();

      socketClient.on('connect', (socket) => {
        console.log('Connected: ', socketClient.id);
      });

      socketClient.on('disconnect', () => {
        console.log('Disconnected: ', socketClient.id);
        socketClient.removeAllListeners();
      });
      return;
    }

    socketClient.disconnect();
  }, [isAuthenticated, socketClient]);

  return (
    <SocketClientProvider value={socketClient}>
      {children}
    </SocketClientProvider>
  );
};

SocketHandler.propTypes = {
  children: PropTypes.node.isRequired,
};

export default SocketHandler;
