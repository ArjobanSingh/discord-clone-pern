import { createContext, useContext } from 'react';

// this context is helpful to prevent prop drilling of props to message or
// different type message components from channel wrapper

export const MessageContext = createContext({});
export const useMessageData = () => useContext(MessageContext);

const MessageProvider = (props) => <MessageContext.Provider {...props} />;

export default MessageProvider;
