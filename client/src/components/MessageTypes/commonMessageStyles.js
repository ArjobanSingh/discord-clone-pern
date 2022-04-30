import styled from 'styled-components';
import DownloadIcon from '@mui/icons-material/Download';
import CircularProgress, { circularProgressClasses } from '@mui/material/CircularProgress';
import { LIGHT_THEME } from '../../constants/theme';

export const MediaMessageContainer = styled.div(({ theme }) => `
  padding-block: ${theme.spacing(0.5)};
`);

export const MediaContainer = styled.div(({
  theme, width, height,
}) => `
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
  position: relative;
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

export const LoaderContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  display: grid;
  place-items: center;

  svg {
    color: ${({ theme }) => theme.palette.common.white};
  }
`;

const FileLoaderContainer = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  right: -10px;
  top: -10px;
  z-index: 100;
  background-color: ${({ theme }) => theme.palette.background.default};
  border-radius: 50%;

  & > div {
    position: relative;
  }
`;

const BackshowCircle = styled(CircularProgress)`
  color: ${({ theme }) => theme.palette.primary.main};
`;

const MainCircle = styled(CircularProgress)`
  position: absolute;
  left: 0;
  color: ${({ theme }) => (theme.palette.mode === LIGHT_THEME
    ? theme.palette.common.black : theme.palette.common.white)};
`;

const Circle = () => (
  <div>
    <BackshowCircle
      variant="determinate"
      size={20}
      thickness={4}
      value={100}
    />
    <MainCircle
      variant="indeterminate"
      disableShrink
      size={20}
      thickness={4}
    />
  </div>
);
export const FileLoader = () => (
  <FileLoaderContainer>
    <Circle />
  </FileLoaderContainer>
);

export const ImageVideoLoader = () => (
  <LoaderContainer>
    <CircularProgress disableShrink />
  </LoaderContainer>
);
