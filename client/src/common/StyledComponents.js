import styled from 'styled-components';

export const FlexDiv = styled.div(({ theme, injectCss }) => `
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  ${injectCss(theme)}
`);

export const test = true;
