import { io } from 'socket.io-client';
import * as C from '../constants/socket-io';

const socket = io('http://localhost:5000');

class SocketClient {
  constructor() {
    this.socket = socket;
    socket.on('connect', () => {
      console.log('Socket connected: ', socket.id);
    });

    socket.on('disconnect', () => {
      socket.removeAllListeners();
      console.log('Socket disconnected: ', socket.id);
    });
  }

  connectAllServers(serversList) {
    this.socket.emit(C.CONNECT_ALL_SERVERS, serversList, (payload) => {
      console.log('connected all servers', payload);
    });
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  getSocket() {
    return this.socket;
  }
}

export default SocketClient;
