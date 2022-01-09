import styled from 'styled-components';

export const FlexDiv = styled.div(({ theme, injectCss }) => `
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  ${injectCss(theme)}
`);

export const Header = styled.header`
  width: 100%;
  padding: 0 16px;
  height: 50px;
  box-shadow: 0 1px 0 rgba(4,4,5,0.2),
              0 1.5px 0 rgba(6,6,7,0.05),
              0 2px 0 rgba(4,4,5,0.05);
  // box-shadow: ${({ theme }) => theme.shadows[1]};
  display: flex;
  align-items: center;
`;
