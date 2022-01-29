import styled from 'styled-components';

export const SettingsContainer = styled.div(({ theme }) => `
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
`);

export const ListContainer = styled.aside(({ theme }) => `
  flex: 0.9;
  background-color: ${theme.palette.background.paper};
  display: flex;
  justify-content: flex-end;
  overflow: hidden;
`);

export const MainContent = styled.main(({ theme }) => `
  flex: 2.1;
  background-color: ${theme.palette.background.default};
  display: flex;
  padding: ${`${theme.spacing(7)} ${theme.spacing(2)}`};
`);

export const SettingsNav = styled.nav(({ theme }) => `
  width: 14rem;
  height: 100%;
  padding: ${`${theme.spacing(7)} ${theme.spacing(2)}`};
  overflow: auto;
`);
