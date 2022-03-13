import styled from 'styled-components';
import Avatar from '@mui/material/Avatar';

export const MessageContainer = styled.div`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing(0.5)} ${theme.spacing(2)}`};
  margin-top: ${({ theme, hideMargin }) => (hideMargin ? '' : theme.spacing(2))};
  
  &:hover {
    background-color: ${({ theme }) => theme.palette.background.paper};
  }
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
