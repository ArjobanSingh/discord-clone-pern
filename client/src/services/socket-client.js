import { io } from 'socket.io-client';
import { getAuthTokens } from '../utils/axiosConfig';
import * as C from '../constants/socket-io';

const URL = 'http://localhost:5000';
const socket = io(URL, { autoConnect: false });

class SocketHandler {
  constructor() {
    this.socket = socket;
  }

  emitEvent(event, ...args) {
    const [accessToken, refreshToken] = getAuthTokens();
    const auth = { accessToken, refreshToken };
    this.socket.emit(event, auth, ...args);
  }

  getSocket() {
    return this.socket;
  }

  connectAllServers(servers) {
    this.emitEvent(C.CONNECT_ALL_SERVERS, servers);
  }

  connectSingleServer(serverId) {
    this.emitEvent(C.CONNECT_SINGLE_SERVER, serverId);
  }
}

const socketHandler = new SocketHandler();

export default socketHandler;
