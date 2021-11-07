import { grey } from '@mui/material/colors';

export const DARK_THEME = 'dark';
export const LIGHT_THEME = 'light';

export const LIGHT_THEME_OPTIONS = {
  palette: {
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
  },
  typography: {
    fontWeightBold: 600,
    fontWeightBolder: 700,
    button: {
      textTransform: 'none',
    },
  },
};

export const DARK_THEME_OPTIONS = {
  palette: {
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
    },
    text: {
      primary: '#fff',
      secondary: grey[300],
    },
  },
  typography: {
    fontWeightBold: 600,
    fontWeightBolder: 700,
    button: {
      textTransform: 'none',
    },
  },
};
