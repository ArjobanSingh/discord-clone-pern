import * as C from '../constants/socket-io';

export const connectServers = (socket, serverIds) => {
  console.log('called how many times!!!!!!!!!!!!!!!!!!!!');
  socket.emit(C.CONNECT_ALL_SERVERS, serverIds, (res) => {
    console.log('Socket response: ', res);
  });
};

export const disconnectSingleServer = (socket, serverId) => {};
