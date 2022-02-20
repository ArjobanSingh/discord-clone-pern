import { createContext, useContext } from 'react';

const SocketClientContext = createContext(null);

export default (props) => (<SocketClientContext.Provider {...props} />);

export const useSocketClient = () => useContext(SocketClientContext);
