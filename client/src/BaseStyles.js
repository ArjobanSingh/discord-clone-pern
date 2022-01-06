import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  body {
    -webkit-tap-highlight-color: transparent;
    line-height: 1.2;
    // font.size(16)}
    // font.regular}
  }

  ::-webkit-scrollbar {
    width: 8px !important;
    height: 8px !important;
  }

  ::-webkit-scrollbar-thumb {
    background-clip: padding-box;
    border: 2px solid transparent;
    border-radius: 4px;
    background-color: ${({ theme }) => theme.palette.background.darker};
    min-height: 40px;
  }

  button,
  input,
  optgroup,
  select,
  textarea {
   // font.regular}
  }

  *, *:after, *:before, input[type="search"] {
    box-sizing: border-box;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul {
    list-style: none;
  }

  ul, li, ol, dd, h1, h2, h3, h4, h5, h6, p {
    padding: 0;
    margin: 0;
  }




  [role="button"], button, input, select, textarea {
    outline: none;
    &:focus {
      outline: none;
    }
    &:disabled {
      opacity: 1;
    }
  }
  [role="button"], button, input, textarea {
    appearance: none;
  }

  body, select {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html {
    touch-action: manipulation;
  }
`;
