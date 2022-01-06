import { createContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  DARK_THEME, DARK_THEME_OPTIONS, LIGHT_THEME, LIGHT_THEME_OPTIONS,
} from '../constants/theme';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

const getDesignTokens = (mode) => (mode === LIGHT_THEME ? LIGHT_THEME_OPTIONS : DARK_THEME_OPTIONS);

const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(DARK_THEME);

  const colorMode = useMemo(() => ({
    toggleColorMode: () => {
      setMode((prev) => (prev === DARK_THEME ? LIGHT_THEME : DARK_THEME));
    },
  }), []);

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <StyledThemeProvider theme={theme}>
          {children}
        </StyledThemeProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

CustomThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CustomThemeProvider;
