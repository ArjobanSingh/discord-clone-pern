import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {
  AbsoluteAvatarWrapper,
  EditProfileBanner,
  EditProfileInfo,
  EditProfileMainContent,
  EditProfileMainWrapper,
  EditProfileOuterContainer,
  UserAvatarContainer,
  UserAvatarIcon,
} from './styles';
import {
  FileInput, Overlay, RemoveFile,
} from '../../ServerSettings/Options/styles';
import Logo from '../../../common/Logo';
import useUser from '../../../customHooks/useUser';
import { handleEnter } from '../../../utils/helperFunctions';

const MyAccount = (props) => {
  const {} = props;
  const { user } = useUser();
  const { profilePicture, name, email } = user;
  const isProfilePictureAlreadySet = !!profilePicture;

  const [isEditing, setIsEditing] = useState(false);

  const handleImageUpload = () => {};
  const removeFile = () => {};

  const editProfile = () => {
    setIsEditing((p) => !p);
  };

  return (
    <>
      <EditProfileOuterContainer>
        <EditProfileBanner />

        <EditProfileInfo isRemoveButton={isEditing && isProfilePictureAlreadySet}>
          <AbsoluteAvatarWrapper>
            <UserAvatarContainer>
              <UserAvatarIcon src={profilePicture} isEditing={isEditing}>
                <Typography lineHeight="0" fontSize="3rem">
                  <Logo />
                </Typography>
              </UserAvatarIcon>

              {isEditing && isProfilePictureAlreadySet && (
                <Overlay>
                  <Typography textAlign="center" color="text.primary">
                    Update avatar
                  </Typography>
                </Overlay>
              )}

              {isEditing && (
                <FileInput
                  type="file"
                  multiple={false}
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              )}
            </UserAvatarContainer>

            {isEditing && isProfilePictureAlreadySet && (
              <RemoveFile
                role="button"
                tabIndex={0}
                onKeyDown={handleEnter(removeFile)}
                onClick={removeFile}
              >
                Remove
              </RemoveFile>
            )}
          </AbsoluteAvatarWrapper>

          <Typography variant="h6" color="text.primary">
            {name}
          </Typography>

          <Button variant="contained" onClick={editProfile}>
            Edit User Profile
          </Button>
        </EditProfileInfo>

        <EditProfileMainWrapper>
          <EditProfileMainContent>
            inputs here
          </EditProfileMainContent>
        </EditProfileMainWrapper>
      </EditProfileOuterContainer>
    </>
  );
};

MyAccount.propTypes = {

};

export default MyAccount;
