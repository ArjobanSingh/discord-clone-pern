import styled from 'styled-components';

export const OptionWrapper = styled.li(({ theme, selected }) => `
  width: 100%;
  padding: ${theme.spacing(1)};
  border-radius: ${theme.shape.borderRadius}px;
  background-color: ${selected
    ? theme.palette.background.default
    : theme.palette.background.paper};
  color: ${selected
    ? theme.palette.text.primary
    : theme.palette.text.secondaryDark};

  &:hover {
    background-color: ${theme.palette.background.default};
    color: ${theme.palette.text.primary};
    cursor: pointer;
  }
`);

export const OptionsList = styled.ul`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(0.5)};
`;
