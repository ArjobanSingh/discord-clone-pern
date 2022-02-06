import { createContext, useContext } from 'react';

const SnackbarContext = createContext({});

export default (props) => <SnackbarContext.Provider {...props} />;

export const useSnackbarValues = () => useContext(SnackbarContext);
