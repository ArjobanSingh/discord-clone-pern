import { Socket } from 'socket.io';

interface ISocket extends Socket {
    name?: string;
    userId?: string;
  }

export default ISocket;
