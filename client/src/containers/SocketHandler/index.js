import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import useIsAuthenticated from '../../customHooks/useIsAuthenticated';
import socketClient from '../../services/socket-client';
import { getAuthTokens } from '../../utils/axiosConfig';
import { logoutSuccess } from '../../redux/actions/auth';
import { internetReconnected } from '../../redux/actions';
import useDidUpdate from '../../customHooks/useDidUpdate';

const socket = socketClient.getSocket();

const SocketHandler = () => {
  const isAuthenticated = useIsAuthenticated();
  const dispatch = useDispatch();

  const setListeners = () => {
    socket.on('connect', () => {
      console.log('Connected: ', socket.id, socket.connected);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected');
    });

    socket.on('connect_error', (err) => {
      console.log('Connect error', err.message);
      if (err.message === 'Not authenticated') {
        console.log('Not authenticated');
        dispatch(logoutSuccess());
      }
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      const [accessToken, refreshToken] = getAuthTokens();
      socket.auth = { accessToken, refreshToken };
      socket.connect();
      setListeners();
      return;
    }

    socket.disconnect();
    socket.removeAllListeners();
  }, [isAuthenticated]);

  useEffect(() => {
    const onOnlineCallback = () => {
      dispatch(internetReconnected());
    };

    window.addEventListener('online', onOnlineCallback);

    return () => {
      window.removeEventListener('online', onOnlineCallback);
    };
  }, []);

  return null;
};

SocketHandler.propTypes = {
};

export default SocketHandler;
