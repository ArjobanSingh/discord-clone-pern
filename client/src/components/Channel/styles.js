import styled from 'styled-components';
import Avatar from '@mui/material/Avatar';

export const membersDrawerWidth = 250;

export const ChannelContainer = styled.div`
  display: flex;
  /* height: calc(100% - 50px); */
  height: 100%;
  width: 100%;
`;

// margin-right: -${membersDrawerWidth}px;
// breakpoint { margin-right: ${isDrawerOpen ? '0' : `-${membersDrawerWidth}px`}; }
export const MainContent = styled.main(({ isDrawerOpen, theme }) => `
  flex-grow: 1;
  width: 100%;

  transition: margin 225ms cubic-bezier(0, 0, 0.2, 1) 0ms,
              width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  ${theme.breakpoints.up('sm')} {
    width: ${isDrawerOpen ? `calc(100% - ${membersDrawerWidth}px)` : '100%'};
  }
`);

export const MemberListContainer = styled.aside`
  height: ${({ isExploringServer }) => (isExploringServer ? 'calc(100% - 88.75px)' : 'calc(100% - 50px)')};
  width: 100%;
  margin-top: ${({ isExploringServer }) => (isExploringServer ? '88.75px' : '50px')};
  padding-inline: ${({ theme }) => theme.spacing(1)};
  overflow: auto;
`;

export const MemberWrapper = styled.div`
  width: 100%;
  padding: ${({ padding }) => padding || '10px'};
  align-items: center;
  gap: 10px;
  display: flex;
  border-radius: ${({ theme }) => theme.shape.borderRadius}px;

  &:hover {
    background-color: ${({ theme }) => theme.palette.background.default};
    // cursor: pointer; TODO: add clickable and view
  }
`;

export const StyledAvatar = styled(Avatar)(({
  theme, fontSize,
}) => `
  width: 35px;
  height: 35px;
  transition: border-radius 0.2s, transform 0.2s;
  background-color: ${theme.palette.success.light};
  color: ${theme.palette.text.primary}
`);
