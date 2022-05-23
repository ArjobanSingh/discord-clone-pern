import styled from 'styled-components';
import Avatar from '@mui/material/Avatar';
import StyledTooltip, { tooltipClasses } from '../../common/StyledToolTip';

export const SidebarContainer = styled('aside')`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  border-right: ${({ borderRight }) => borderRight || ''};

  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: 50px;
    height: calc(100% - 50px);
  }
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
const getBackgroundColor = ({ theme, selected, explore }) => {
  if (!selected) return theme.palette.background.default;
  if (explore) return theme.palette.success.light;
  return theme.palette.primary.main;
};

const getColor = ({ theme, selected, explore }) => {
  if (selected) return theme.palette.text.primary;
  if (explore) return theme.palette.success.light;
  return theme.palette.text.primary;
};

export const StyledAvatar = styled(Avatar)(({
  theme, selected, fontSize, explore,
}) => `
  background-color: ${getBackgroundColor({ theme, selected, explore })};
  color: ${getColor({ theme, selected, explore })};
  width: 50px;
  height: 50px;
  transition: border-radius 0.2s, transform 0.2s;
  font-size: ${fontSize || theme.typography.subtitle1.fontSize};
  border-radius: ${selected ? '30%' : '50%'};
  position: revert;

  &:hover {
    border-radius: 30%;
    background-color: ${explore
    ? theme.palette.success.light : theme.palette.primary.main};
    color: ${theme.palette.text.primary};
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

export const ServerListTooltip = styled(StyledTooltip)(({ theme }) => `
  .${tooltipClasses.tooltip} {
    font-size: ${theme.typography.subtitle1.fontSize};
  }
`);
