import styled from 'styled-components';
import IconButton from '@mui/material/IconButton';

export const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  position: ${({ position }) => position};
  opacity: ${({ opacity }) => opacity};
  border-radius: inherit;
  filter: ${({ filter }) => filter};
`;

export const DownloadIconWrapper = styled(IconButton)(({ theme }) => `
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);

  &:hover {
    background: ${theme.palette.background.default};
  }
`);
