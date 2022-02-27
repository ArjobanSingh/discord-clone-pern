import { io } from 'socket.io-client';
import { getAuthTokens } from '../utils/axiosConfig';

const URL = 'http://localhost:5000';
const socket = io(URL, { autoConnect: false });

class SocketHandler {
  constructor() {
    this.socket = socket;
    this.emitEvent = this.emitEvent.bind(this);
    this.getSocket = this.getSocket.bind(this);
  }

  emitEvent(...args) {
    const [accessToken, refreshToken] = getAuthTokens();
    const auth = { accessToken, refreshToken };
    this.socket.emit(auth, ...args);
  }

  getSocket() {
    return this.socket;
  }
}

const socketHandler = new SocketHandler();

export default socketHandler;
