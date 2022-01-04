import { styled } from '@mui/material/styles';

export const SidebarContainer = styled('aside')`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
`;

export const ServerIconList = styled('div')(({ theme }) => `
  height: 100%;
  overflow: auto;
  padding: ${theme.spacing(1)};
  background-color: ${theme.palette.background.darker}
`);
