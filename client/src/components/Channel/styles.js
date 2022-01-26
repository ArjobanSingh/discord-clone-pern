import styled from 'styled-components';

export const membersDrawerWidth = 300;

export const ChannelContainer = styled.div`
  display: flex;
  height: calc(100% - 50px);
  width: 100%;
`;

export const MainContent = styled.main(({ isDrawerOpen, theme }) => `
  margin-right: -${membersDrawerWidth}px;
  flex-grow: 1;

  transition: margin 225ms cubic-bezier(0, 0, 0.2, 1) 0ms,
              width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  ${theme.breakpoints.up('sm')} {
    margin-right: ${isDrawerOpen ? '0' : `-${membersDrawerWidth}px`};
  }
`);
