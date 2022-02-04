import styled from 'styled-components';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

export const SettingsContainer = styled.div(({ theme }) => `
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
`);

export const ListContainer = styled.aside(({ theme }) => `
  flex: 0.9;
  background-color: ${theme.palette.background.paper};
  display: none;
  justify-content: flex-end;
  overflow: hidden;

  ${theme.breakpoints.up('md')} {
    display: flex;
  }
`);

export const MainContent = styled.main(({ theme }) => `
  flex: 2.1;
  background-color: ${theme.palette.background.default};
  display: flex;
  padding: ${`${theme.spacing(7)} ${theme.spacing(2)}`};
  position: relative;
`);

export const SettingsNav = styled.nav(({ theme }) => `
  width: 14rem;
  height: 100%;
  padding: ${`${theme.spacing(7)} ${theme.spacing(2)}`};
  overflow: auto;
`);

export const ServerOptionsDrawer = styled(Drawer)(({ theme }) => `
  display: block;
  z-index: ${theme.zIndex.modal + 1};
  .${drawerClasses.paper} {
    width: 14rem;
    box-sizing: border-box;
  }

  ${theme.breakpoints.up('md')} {
    display: none;
  }
`);
