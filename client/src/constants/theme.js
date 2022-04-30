import { darken } from '@mui/material';
import { grey } from '@mui/material/colors';

export const DARK_THEME = 'dark';
export const LIGHT_THEME = 'light';

export const LIGHT_THEME_OPTIONS = {
  palette: {
    mode: LIGHT_THEME,
    type: LIGHT_THEME,
    input: {
      background: '#fff',
      borderColor: 'rgb(186, 186, 186)',
    },
    primary: {
      main: '#606cec',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#fff',
      paper: '#fafafa',
      darker: darken('#fafafa', 0.2),
    },
    text: {
      secondary: grey[600],
      secondaryDark: grey[800],
    },
  },
  typography: {
    fontWeightBold: 600,
    fontWeightBolder: 700,
    fontFamily: "'Open Sans', sans-serif",
    button: {
      textTransform: 'none',
    },
  },
};

export const DARK_THEME_OPTIONS = {
  palette: {
    mode: DARK_THEME,
    type: DARK_THEME,
    input: {
      background: 'rgba(0, 0, 0, 0.1)',
      borderColor: 'rgba(0, 0, 0, 0.3)',
    },
    primary: {
      main: '#606cec',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#36393f',
      paper: '#2c2f33',
      darker: darken('#2c2f33', 0.2),
    },
    text: {
      primary: '#fff',
      secondaryDark: grey[500],
      secondary: grey[300],
    },
  },
  typography: {
    fontWeightBold: 600,
    fontWeightBolder: 700,
    fontFamily: "'Open Sans', sans-serif",
    button: {
      textTransform: 'none',
    },
  },
};
