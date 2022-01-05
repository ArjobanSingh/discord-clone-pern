import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';

export const SidebarContainer = styled('aside')`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
`;

export const ServerIconList = styled('div')(({ theme }) => `
  height: 100%;
  overflow: auto;
  padding: ${theme.spacing(1.5)};
  background-color: ${theme.palette.background.darker};
  display: flex;
  flex-direction: column;
  gap: 10px;
`);

export const StyledAvatar = styled(Avatar)(({ theme, selected }) => `
  background-color: ${selected
    ? theme.palette.primary.main : theme.palette.background.default};
  color: #fff;
  width: 50px;
  height: 50px;
  transition: border-radius 0.2s linear;
  font-size: ${theme.typography.subtitle1.fontSize};
  border-radius: ${selected ? '30%' : '50%'};

  &:hover {
    border-radius: 30%;
    background-color: ${theme.palette.primary.main};
    cursor: pointer;
  };
`);
