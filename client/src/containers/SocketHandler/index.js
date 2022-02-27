import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import useIsAuthenticated from '../../customHooks/useIsAuthenticated';
import socketClient from '../../services/socket-client';
import { getAuthTokens } from '../../utils/axiosConfig';
import { logoutSuccess } from '../../redux/actions/auth';

const socket = socketClient.getSocket();

const SocketHandler = () => {
  const isAuthenticated = useIsAuthenticated();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      const [accessToken, refreshToken] = getAuthTokens();
      socket.auth = { accessToken, refreshToken };
      socket.connect();

      socket.on('connect', () => {
        console.log('Connected: ', socket.id, socket.connected);
      });

      socket.on('disconnect', () => {
        console.log('Disconnected');
        socket.removeAllListeners();
      });

      socket.on('connect_error', (err) => {
        if (err.message === 'Not authenticated') {
          console.log('Not authenticated');
          dispatch(logoutSuccess());
        }
      });
      return;
    }

    socket.disconnect();
  }, [isAuthenticated]);

  return null;
};

SocketHandler.propTypes = {
};

export default SocketHandler;
