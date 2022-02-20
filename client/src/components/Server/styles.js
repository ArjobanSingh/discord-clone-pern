import styled from 'styled-components';
import Button from '@mui/material/Button';

export const ServerContainer = styled.div`
  flex: 1;
  height: 100%;
  overflow: hidden;
`;

export const PreviewBar = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.palette.primary.main};
  padding: ${({ theme }) => theme.spacing(0.5)};
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  gap: 10px;
  padding-left: 90px;
  z-index: ${({ theme }) => theme.zIndex.drawer + 1};
`;

export const StyledButton = styled(Button)(({ theme, back }) => `
  border-color: ${theme.palette.common.white};
  color: ${theme.palette.common.white};
  font-weight: ${theme.typography.fontWeightMedium};
  min-height: 30.75px;

  ${back ? `
    position: absolute;
    left: ${theme.spacing(0.5)};
  ` : ''}

  &:hover {
    background-color: ${theme.palette.primary.dark};
    border-color: ${theme.palette.common.white};
  }
`);
