import styled from 'styled-components';
import Avatar from '@mui/material/Avatar';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';

export const IconAvatar = styled(Avatar)(({
  theme,
}) => `
    background-color: ${theme.palette.primary.main};
    color: ${theme.palette.text.primary};
    width: 100px;
    height: 100px;
    box-shadow: ${theme.shadows[6]};
  
    &:hover {
      cursor: pointer;
    };
  
  `);

export const AvatarContainer = styled.div`
  position: relative;
`;

export const FileInput = styled.input`
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    font-size: 0px;
`;

export const UploadButton = styled(Button)(({ theme }) => `
  color: ${theme.palette.common.white};
  border-color: ${theme.palette.common.white};
  margin-top: ${theme.spacing(2)};
  position: relative;

  &:hover {
    border-color: ${theme.palette.common.white};
    cursor: pointer;
  }
`);

export const TypeSelect = styled(Select)(({ theme }) => `
  height: 41px;
  width: 100%;
  border-radius: ${theme.shape.borderRadius}px;
  background: ${theme.palette.input.background};
  color: ${theme.palette.text.primary};

  .MuiSelect-select {
    padding: 0 8px;
  }

  & .MuiOutlinedInput-notchedOutline,
  &.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: ${theme.palette.input.borderColor} !important;
    border: 1px solid ${theme.palette.input.borderColor};
  }
`);

export const OverviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)};
`;
