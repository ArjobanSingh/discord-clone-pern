import styled from 'styled-components';
import DownloadIcon from '@mui/icons-material/Download';

export const MediaMessageContainer = styled.div(({ theme }) => `
  padding-block: ${theme.spacing(0.5)};
`);

export const MediaContainer = styled.div(({ theme, width, height }) => `
  position: relative;
  width: ${width}px;
  height: ${height}px;
  border-radius: ${theme.shape.borderRadius}px;
`);

export const FileContainer = styled.div(({ theme }) => `
  padding: ${theme.spacing(1)};
  background-color: ${theme.palette.background.darker};
  border-radius: ${theme.shape.borderRadius}px;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`);

export const FileTopContainer = styled.div`
  display: flex;
  width: 100%;
  height: 40px;
  overflow: hidden;
  gap: 10px;
`;

export const StyledDownloadIcon = styled(DownloadIcon)(({ theme }) => `
  color: ${theme.palette.primary.secondaryDark};
  cursor: pointer;
`);

export const FileNameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 3px;
  justify-content: center;
`;

export const Anchor = styled.a(({ theme }) => `
  color: ${theme.palette.primary.main};
  font-size: ${theme.typography.body2.fontSize};
  line-height: 1;
  
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`);
