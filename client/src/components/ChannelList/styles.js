import styled from 'styled-components';
import Menu, { menuClasses } from '@mui/material/Menu';
import AddIcon from '@mui/icons-material/Add';
import ListItemButton from '@mui/material/ListItemButton';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ListItemText from '@mui/material/ListItemText';
import { INVITE_USERS_ICON } from '../../constants/images';

export const StyledAddIcon = styled(AddIcon)`
  color: ${({ theme }) => theme.palette.text.secondary};

  &:hover {
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;

export const StyledListButton = styled(ListItemButton)`
  &:hover {
    background-color: inherit;
  }
`;

export const StyledListText = styled(ListItemText)`
  color: ${({ theme }) => theme.palette.text.secondary};

  &:hover {
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;

export const ChannelListContainer = styled.div`
  height: 100%;
  width: 100%;
  max-width: 245px;
  overflow-x: hidden;
`;

export const InviteSectionWrapper = styled.section`
  padding: 80px 20px 20px;
  border-bottom: 0.5px solid ${({ theme }) => theme.palette.divider};
  text-align: center;
  position: relative;
  background: url(${INVITE_USERS_ICON}) no-repeat center 20px;
`;

export const InviteSection = styled.div`
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: ${({ theme }) => theme.typography.subtitle2.fontSize};

  button {
    margin: 1rem auto 0;
  }
`;

export const StyledMenu = styled(Menu)(({ theme }) => `
  .${menuClasses.paper} {
    border-radius: ${theme.shape.borderRadius}px;
    color: ${theme.palette.text.primary};
    background-color: ${theme.palette.background.darker};
    padding: ${theme.spacing(0.5)};
  }

  .server-settings-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: ${theme.typography.subtitle2.fontSize};
    font-weight: normal;
    color: ${theme.palette.text.secondary};
    padding: ${theme.spacing(1)};
    border-radius: ${theme.shape.borderRadius}px;
    min-width: 200px;

    &:hover {
      color: ${theme.palette.text.primary};
      background-color: ${theme.palette.primary.main};
      cursor: pointer;
    }
  }

  .leave-server {
    color: ${theme.palette.error.dark};

    &:hover {
      color: ${theme.palette.text.primary};
      background-color: ${theme.palette.error.main};
    }
  }
`);

export const ListContainer = styled.div(({ isInviteBoxVisible }) => `
  height: ${isInviteBoxVisible ? 'calc(100% - 245px)' : 'calc(100% - 190px)'};
  width: 100%;
`);

export const ExpandableIcon = styled(({ isExpanded, ...rest }) => <ArrowForwardIosIcon {...rest} />)`
  transform: ${({ isExpanded }) => (isExpanded ? 'rotate(90deg)' : '')};
  color: ${({ theme }) => theme.palette.text.secondary};
  transition: transform .3s;
  font-size: 0.75rem;
  margin-right: ${({ theme }) => theme.spacing(1)};

  &:hover {
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;

export const ChannelItem = styled.div(({ theme, isChannelOpened }) => `
  padding: ${theme.spacing(1)};
  margin-inline: ${theme.spacing(1)};
  color: ${theme.palette.text.secondaryDark};
  display: flex;
  align-items: center;
  gap: ${theme.spacing(1)};
  background-color: ${isChannelOpened ? theme.palette.background.default : 'transparent'};
  border-radius: ${theme.shape.borderRadius}px;

  &:hover {
    background-color: ${theme.palette.background.default};
    cursor: pointer;
  }
`);

export const ChannelTypeContainer = styled.div`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;
