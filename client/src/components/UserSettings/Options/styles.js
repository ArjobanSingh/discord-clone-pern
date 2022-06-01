/* eslint-disable react/prop-types */
import styled from 'styled-components';
import { AvatarContainer, IconAvatar } from '../../ServerSettings/Options/styles';

export const EditProfileOuterContainer = styled.form(({ theme }) => `
  width: 100%;
  border-radius: ${theme.shape.borderRadius * 1.5}px;
  background-color: ${theme.palette.background.darker};
  display: flex;
  flex-direction: column;
  position: relative;
`);

export const EditProfileBanner = styled.div`
  width: 100%;
  height: 100px;
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
  background-color: ${({ theme }) => theme.palette.primary.main};
`;

export const EditProfileInfo = styled.div(({ theme, isRemoveButton }) => `
  padding: ${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(1)} ${theme.spacing(16)};
  height: ${isRemoveButton ? '100px' : '80px'};
  display: flex;
  justify-content: space-between;
  align-items: center;
`);

export const EditProfileMainWrapper = styled.main(({ theme }) => `
  padding: ${theme.spacing(2)};
  flex: 1;  
`);

export const EditProfileMainContent = styled.div(({ theme }) => `
  padding: ${theme.spacing(2)};
  border-radius: ${theme.shape.borderRadius}px;
  width: 100%;
  height: 100%;
  background-color: ${theme.palette.background.default};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(2)};
`);

export const AbsoluteAvatarWrapper = styled.div`
  position: absolute;
  top: 76px;
  left: ${({ theme }) => theme.spacing(2)};
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
`;

export const UserAvatarContainer = styled(AvatarContainer)``;

const EscapeIconProps = ({ isEditing, ...props }) => <IconAvatar {...props} />;

export const UserAvatarIcon = styled(EscapeIconProps)(({ theme, isEditing }) => `
  border: 8px solid ${theme.palette.background.darker};
  background-color: '';

  &:hover {
    cursor: ${isEditing ? 'pointer' : 'default'};
  }
`);

export const ProfileItem = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  & > div {
    width: 100%;
  }
`;

export const InlineInput = styled.input(({ theme, isEditing }) => `
  outline: none;
  border: none;
  width: 100%;
  color: ${theme.palette.text.primary};
  font-size: ${theme.typography.body2.fontSize};
  padding: ${theme.spacing(1)};
  padding-left: ${isEditing ? theme.spacing(0.5) : '0'};
  background-color: ${isEditing ? theme.palette.background.darker : 'transparent'};
  border-radius: ${theme.shape.borderRadius}px;
`);

export const EditModeButtonsWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
  align-items: center;
`;
