import styled from 'styled-components';

export const InviteModalContainer = styled.div(({ theme }) => `
  border-radius: ${theme.shape.borderRadius}px;
  background: ${theme.palette.background.default};
  color: ${theme.palette.text.primary};
  padding: ${theme.spacing(2)};

  ${theme.breakpoints.up('xs')} {
    width: 22.5rem;
  };

  ${theme.breakpoints.up('sm')} {
    width: 28rem;
  };
`);

export const test = true;
