import styled from 'styled-components';
import Menu, { menuClasses } from '@mui/material/Menu';
import { INVITE_USERS_ICON } from '../../constants/images';

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
  background: url(${INVITE_USERS_ICON}) no-repeat center 20px
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
