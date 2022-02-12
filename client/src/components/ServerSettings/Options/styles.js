import styled from 'styled-components';
import Avatar from '@mui/material/Avatar';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { grey } from '@mui/material/colors';

export const IconAvatar = styled(Avatar)(({
  theme,
}) => `
    background-color: ${theme.palette.primary.main};
    color: ${theme.palette.text.primary};
    width: inherit;
    height: inherit;
    box-shadow: ${theme.shadows[6]};
  
    &:hover {
      cursor: pointer;
    };
  
  `);

export const AvatarContainer = styled.div`
  position: relative;
  height: 100px;
  width: 100px;
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

export const MembersInfoBar = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  gap: 5px;
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  border-bottom: 1px solid ${grey[700]};
  flex-wrap: wrap;
`;

export const LineSelect = styled(Select)(({ theme }) => `
  background: transparent;
  box-shadow: none;
  font-size: ${theme.typography.subtitle2.fontSize};

  &:before,
  &:after,
  &:hover:after {
    border: none;
  }

  & .MuiSelect-select:focus {
    background: transparent;
  }
`);

export const SelectOption = styled(MenuItem)(({ theme }) => `
`);

export const SearchInput = styled.input(({ theme }) => `
  border: none;
  outline: none;
  background-color: ${theme.palette.background.darker};
  border-radius: ${theme.shape.borderRadius}px;
  color: ${theme.palette.text.secondary};
  font-size: ${theme.typography.subtitle2.fontSize};
  width: 180px;
  padding: ${theme.spacing(0.7)};
`);
