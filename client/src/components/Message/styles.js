import styled from 'styled-components';
import Avatar from '@mui/material/Avatar';
import { blue, blueGrey, grey } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import { darken } from '@mui/material';

export const OptionsContainer = styled.div(({ theme }) => `
  display: none;
  position: absolute;
  right: 20px;
  top: -20px;
  align-items: center;
  background-color: ${darken(theme.palette.background.default, 0.2)};
  border: 1px solid ${theme.palette.background.darker};
  color: ${theme.palette.text.secondary};
  border-radius: ${theme.shape.borderRadius}px;

  &:hover {
    box-shadow: ${theme.shadows[1]};
  }

  div {
    cursor: pointer;
    padding: ${theme.spacing(0.5)};

    :hover {
      background-color: ${theme.palette.background.darker};
    }
  }

  svg {
    font-size: ${theme.typography.h6.fontSize};
  }
`);

export const MessageContainer = styled.div`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing(0.1)} ${theme.spacing(2)}`};
  margin-top: ${({ theme, hideMargin }) => (hideMargin ? '' : theme.spacing(2))};
  background-color: ${({ shouldHighlight, isReplyMessage }) => {
    if (isReplyMessage) return `${blueGrey[800]}90`;
    if (shouldHighlight) return grey[800];
    return 'inherit';
  }};
  position: relative;

  &:hover {
    background-color: ${({ theme, isReplyMessage }) => (isReplyMessage
    ? blueGrey[800] : theme.palette.background.paper)};

    ${OptionsContainer} {
      display: flex;
    }
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

export const MessageContent = styled(Typography)`
  line-height: 1.375rem;
  color: ${({ theme }) => theme.palette.text.primary};
  white-space: break-spaces;
`;
