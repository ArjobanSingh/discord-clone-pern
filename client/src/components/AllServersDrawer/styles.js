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
  overflow: hidden auto;
  background-color: ${theme.palette.background.darker};
  padding-block: ${theme.spacing(1.5)};
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  min-width: 74px;

  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`);

export const VerticalBar = styled('div')(({ theme, selected }) => `
  height: ${selected ? '80%' : '20%'};
  width: 5px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  position: absolute;
  left: 0;
  background-color: ${theme.palette.text.primary};
  transition: height 0.2s;
`);

export const StyledAvatar = styled(Avatar)(({ theme, selected }) => `
  background-color: ${selected
    ? theme.palette.primary.main : theme.palette.background.default};
  color: ${theme.palette.text.primary};
  width: 50px;
  height: 50px;
  transition: border-radius 0.2s, transform 0.2s;
  font-size: ${theme.typography.subtitle1.fontSize};
  border-radius: ${selected ? '30%' : '50%'};
  position: revert;

  &:hover {
    border-radius: 30%;
    background-color: ${theme.palette.primary.main};
    cursor: pointer;
  };

  &:hover + ${VerticalBar} {
    height: ${selected ? '80%' : '50%'};
  }

  &:active {
    transform: translateY(4px);
  }
`);

export const Bar = styled('div')(({ theme }) => `
  width: 40px;
  height: 2px;
  min-height: 2px;
  background-color: ${theme.palette.background.default};
`);

export const barStyleCss = () => `
  flex-direction: column;
  gap: 5px;
`;

export const AvatarWrapper = styled('div')(({ theme }) => `
  padding-inline: ${theme.spacing(1.5)};
  position: relative;
  display: flex;
  align-items: center;
`);
