import styled from 'styled-components';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Avatar from '@mui/material/Avatar';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  place-items: center;
  background-color: rgba(0, 0, 0, 0.7);
  display: grid;
`;

export const AvatarContainer = styled.div`
  position: relative;
  height: 100px;
  width: 100px;

  & ${Overlay} {
    border-radius: 50%;
    opacity: 0;
  }

  &:hover {
    & ${Overlay} {
      opacity: 1;
    }
  }
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
  border-bottom: 1px solid ${grey[800]};
  // flex-wrap: wrap;
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

export const MemberSettingIcon = styled(MoreVertIcon)(({ theme }) => `
  color: ${theme.palette.text.secondaryDark};
  margin-left: auto;

  &:hover {
    color: ${theme.palette.text.primary};
    cursor: pointer;
  }
`);

export const MemberItem = styled.div(({ theme }) => `
  width: 100%;
  display: flex;
  gap: ${theme.spacing(2)};
  padding-block: ${theme.spacing(2)};
  border-bottom: 1px solid ${grey[800]};
  align-items: center;

  & ${MemberSettingIcon} {
    display: none;
  }

  &:hover {
    & ${MemberSettingIcon} {
      display: block;
    }
  }
`);

export const StyledAvatar = styled(Avatar)(({
  theme,
}) => `
  width: 40px;
  height: 40px;
  background-color: ${theme.palette.primary.main};
  color: ${theme.palette.text.primary}
`);

export const RoleChip = styled.div(({ theme, isUserRoleSuperior }) => `
  background-color: ${theme.palette.background.darker};
  padding: ${theme.spacing(0.5)} ${theme.spacing(1)};
  border-radius: ${theme.shape.borderRadius}px;
  cursor: ${isUserRoleSuperior ? 'pointer' : ''};
`);

export const EmptyBanner = styled.div(({ theme }) => `
  width: 320px;
  height: 180px;
  background-color: #4f545c;
  border-radius: ${theme.shape.borderRadius}px;
  position: relative;

  & ${Overlay} {
    opacity: 0;
  }

  &:hover {
    & ${Overlay} {
      opacity: 1;
    }
  }
`);

export const UploadBannerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const StyledCloudIcon = styled(CloudUploadIcon)`
  font-size: 60px;
`;
