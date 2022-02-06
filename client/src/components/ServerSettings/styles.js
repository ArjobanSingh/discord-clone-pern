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

export const OptionContentContainer = styled.div`
  width: 100%;
  max-width: 42rem;
  height: 100%;
  padding-inline: ${({ theme }) => theme.spacing(2)};

  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const UnsavedWrapper = styled.div(({ theme }) => `
  background-color: ${theme.palette.background.darker};
  width: 600px;
  opacity: 0.7;
  padding: ${theme.spacing(2)};
  border-radius: ${theme.shape.borderRadius}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`);
