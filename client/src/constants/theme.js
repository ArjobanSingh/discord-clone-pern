import { grey } from '@mui/material/colors';

export const DARK_THEME = 'dark';
export const LIGHT_THEME = 'light';

export const LIGHT_THEME_OPTIONS = {
  palette: {
    type: LIGHT_THEME,
    primary: {
      main: '#606cec',
    },
    secondary: {
      main: '#f50057',
    },
  },
};

export const DARK_THEME_OPTIONS = {
  palette: {
    type: DARK_THEME,
    primary: {
      main: '#606cec',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#23272a',
      paper: '#2c2f33',
    },
    text: {
      primary: '#fff',
      secondary: grey[500],
    },
  },
};
