import styled from 'styled-components';

export const DateContainer = styled.div(({ theme }) => `
  width: 100%;
  margin: ${theme.spacing(2)} ${theme.spacing(2)} 0;
  height: 0;
  border-top: thin solid ${theme.palette.text.secondaryDark};
  display: flex;
  justify-content: center;
  align-items: center;
`);
