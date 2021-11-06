import { styled } from '@mui/material/styles';

export default styled('img')(({ height = '', width = '', position = '' }) => `
  height: ${height};
  width: ${width};
  position: ${position};
`);
