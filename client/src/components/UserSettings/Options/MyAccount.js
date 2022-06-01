import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import {
  AbsoluteAvatarWrapper,
  EditProfileBanner,
  EditProfileInfo,
  EditProfileMainContent,
  EditProfileMainWrapper,
  EditProfileOuterContainer,
  UserAvatarContainer,
  ProfileItem,
  UserAvatarIcon,
  InlineInput,
  EditModeButtonsWrapper,
} from './styles';
import {
  AbsoluteProgress,
  ConfirmationButton,
  FileInput, Overlay, RemoveFile,
} from '../../ServerSettings/Options/styles';
import Logo from '../../../common/Logo';
import useUser from '../../../customHooks/useUser';
import useIsMounted from '../../../customHooks/useIsMounted';
import { handleEnter, handleError } from '../../../utils/helperFunctions';
import { MAX_FILE_SIZE } from '../../../constants/Message';
import axiosInstance from '../../../utils/axiosConfig';
import { UserApi } from '../../../utils/apiEndpoints';
import { isEmailValid } from '../../../utils/validators';
import { userValidation } from '../../../constants/user';
import { updateUserDetails } from '../../../redux/actions/user';

const {
  USER_NAME_MIN_LENGTH,
  USER_NAME_MAX_LENGTH,
} = userValidation;

const saveUserDetailsOnServer = async ({ userName, userEmail, userProfilePic }) => {
  const url = UserApi.PATCH_CURRENT_USER;
  const formData = new FormData();
  formData.append('name', userName);
  formData.append('email', userEmail);

  const { file, url: fileUrl } = userProfilePic;

  if (file) formData.append('profilePicture', file);
  else if (fileUrl) formData.append('profilePicture', fileUrl);

  const response = await axiosInstance.patch(url, formData);

  return response.data;
};

const MyAccount = (props) => {
  const {} = props;

  const isMounted = useIsMounted();
  const { user } = useUser();
  const dispatch = useDispatch();

  const { profilePicture, name, email } = user;

  const [isEditing, setIsEditing] = useState(false);
  const [userDetails, setUserDetails] = useState({
    userName: name,
    userEmail: email,
    userProfilePic: {
      url: profilePicture,
      file: null,
    },
  });
  const [isUpdatingApi, setIsUpdatingApi] = useState(false);

  const {
    userName,
    userEmail,
    userProfilePic,
  } = userDetails;

  const userNameRef = useRef();
  const userEmailRef = useRef();
  const isProfilePictureAlreadySet = !!userProfilePic.url;

  useEffect(() => {
    if (isEditing) {
      userNameRef.current.focus();
    }
  }, [isEditing]);

  const handleImageUpload = (e) => {
    const [currentFile] = e.target.files || e.nativeEvent?.target?.files;
    if (!currentFile) {
      toast.error('Some error occurred, Please try again');
      return;
    }

    const { size, type: fileType } = currentFile;

    if (!fileType.match('image.*')) {
      toast.error('Only Image files are supported');
      return;
    }

    if (size > MAX_FILE_SIZE) {
      toast.error('Max file size is 3mb');
      return;
    }

    const newFileUrl = URL.createObjectURL(currentFile);

    setUserDetails((prev) => {
      if (prev.userProfilePic.url) {
        URL.revokeObjectURL(prev.userProfilePic.url);
      }

      return {
        ...prev,
        userProfilePic: {
          file: currentFile,
          url: newFileUrl,
        },
      };
    });
  };

  const removeFile = () => {
    setUserDetails((prev) => ({
      ...prev,
      userProfilePic: {
        url: null,
        file: null,
      },
    }));
  };

  const editProfile = () => {
    setIsEditing(true);
  };

  const onValueChange = (e) => {
    const { name: htmlName, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [htmlName]: value,
    }));
  };

  const resetChanges = () => {
    setIsEditing(false);
    // reset to previous changes
    setUserDetails({
      userName: name,
      userEmail: email,
      userProfilePic: {
        url: profilePicture,
        file: null,
      },
    });
  };

  const saveProfileChanges = async (e) => {
    e.preventDefault();

    const trimmedUserName = userName.trim();

    if (trimmedUserName.length < USER_NAME_MIN_LENGTH
      || trimmedUserName.length > USER_NAME_MAX_LENGTH) {
      toast.error(`User name length must be between ${USER_NAME_MIN_LENGTH} and ${USER_NAME_MAX_LENGTH}`);
      return;
    }

    if (!isEmailValid(userEmail)) {
      toast.error('Invalid email id');
      return;
    }

    try {
      setIsUpdatingApi(true);
      const response = await saveUserDetailsOnServer({
        userName,
        userEmail,
        userProfilePic,
      });
      dispatch(updateUserDetails(response));
      if (isMounted.current) {
        setUserDetails({
          userName: response.name,
          userEmail: response.email,
          userProfilePic: {
            url: response.profilePicture,
            file: null,
          },
        });
        setIsEditing(false);
      }
    } catch (err) {
      const sessionExpireError = handleError(err, (error) => {
        toast.error(`Error updating user details: ${error.message}`);
        return undefined;
      });
      if (sessionExpireError) dispatch(sessionExpireError);
    } finally {
      setIsUpdatingApi(false);
    }
  };

  const details = [{
    title: 'Username',
    value: userName,
    name: 'userName',
    placeholder: 'Enter user name',
    type: 'text',
    ref: userNameRef,
  }, {
    title: 'Email',
    value: userEmail,
    name: 'userEmail',
    placeholder: 'Enter user email',
    type: 'email',
    email: userEmailRef,
  }];

  return (
    <>
      <EditProfileOuterContainer
        onReset={resetChanges}
        onSubmit={saveProfileChanges}
      >
        <EditProfileBanner />

        <EditProfileInfo isRemoveButton={isEditing && isProfilePictureAlreadySet}>
          <AbsoluteAvatarWrapper>
            <UserAvatarContainer>
              <UserAvatarIcon
                src={userProfilePic.url}
                isEditing={isEditing}
              >
                <Typography lineHeight="0" fontSize="3rem">
                  <Logo />
                </Typography>
              </UserAvatarIcon>

              {isEditing && (
                <Overlay>
                  <Typography
                    padding={(theme) => theme.spacing(1)}
                    textAlign="center"
                    color="text.primary"
                  >
                    {isProfilePictureAlreadySet
                      ? 'Update avatar'
                      : 'Upload avatar'}
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

          {isEditing
            ? (
              <EditModeButtonsWrapper>
                <Button
                  variant="contained"
                  type="reset"
                  color="error"
                >
                  Reset
                </Button>

                <ConfirmationButton
                  variant="contained"
                  type="submit"
                  color="success"
                  isLoading={isUpdatingApi}
                >
                  <span className="button-text">
                    Save
                  </span>
                  {isUpdatingApi && <AbsoluteProgress color="inherit" size={20} />}
                </ConfirmationButton>
              </EditModeButtonsWrapper>
            )
            : (
              <Button variant="contained" onClick={editProfile}>
                Edit User Profile
              </Button>
            )}

        </EditProfileInfo>

        <EditProfileMainWrapper>
          <EditProfileMainContent>
            {details.map((detail) => (
              <ProfileItem key={detail.title}>
                <div>
                  <Typography
                    fontWeight="fontWeightMedium"
                    variant="body2"
                    color="text.secondary"
                  >
                    {detail.title}
                  </Typography>
                  <InlineInput
                    required
                    value={detail.value}
                    disabled={!isEditing}
                    name={detail.name}
                    onChange={onValueChange}
                    ref={detail.ref}
                    isEditing={isEditing}
                  />
                </div>
              </ProfileItem>
            ))}
          </EditProfileMainContent>
        </EditProfileMainWrapper>
      </EditProfileOuterContainer>
    </>
  );
};

MyAccount.propTypes = {

};

export default MyAccount;
