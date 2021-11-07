import { styled } from '@mui/material/styles';

export const InputWrapper = styled('div')`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const Anchor = styled('a')(({ theme }) => `
  color: ${theme.palette.primary.main};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`);
