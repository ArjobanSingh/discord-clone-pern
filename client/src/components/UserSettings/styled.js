import styled from 'styled-components';

export const Container = styled.div(({ theme }) => `
  background-color: ${theme.palette.background.default};
  width: 100%;
  height: 100%;
`);
