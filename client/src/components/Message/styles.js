import styled from 'styled-components';
import Avatar from '@mui/material/Avatar';
import { grey } from '@mui/material/colors';

export const MessageContainer = styled.div`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing(0.5)} ${theme.spacing(2)}`};
  margin-top: ${({ theme, hideMargin }) => (hideMargin ? '' : theme.spacing(2))};
  background-color: ${({ shouldHighlight }) => (shouldHighlight ? grey[800] : 'inherit')};

  &:hover {
    background-color: ${({ theme }) => theme.palette.background.paper};
  }
`;

export const AvatarMessageContainer = styled.div`
  display: flex;
  gap: 15px;
`;

export const StyledAvatar = styled(Avatar)(({
  theme,
}) => `
    width: 40px;
    height: 40px;
    background-color: ${theme.palette.primary.main};
    color: ${theme.palette.text.primary};
    font-size: ${theme.typography.h5.fontSize};
`);

export const HoverableTime = styled.div`
  font-size: 0.675rem;
  position: absolute;
  color: ${({ theme }) => theme.palette.text.secondaryDark};
  display: none;
`;

export const SameUserMessage = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;

  &:hover ${HoverableTime} {
    display: block;
  }
`;
