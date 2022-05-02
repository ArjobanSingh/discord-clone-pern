import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { useParams } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import { useDispatch, useSelector } from 'react-redux';
import {
  AvatarContainer,
  FileInput,
  IconAvatar,
  OverviewContainer,
  TypeSelect,
  UploadButton,
  EmptyBanner,
  StyledCloudIcon,
  UploadBannerWrapper,
  Overlay,
} from './styles';
import useServerData from '../../../customHooks/useServerData';
import { getCharacterName, stopPropagation } from '../../../utils/helperFunctions';
import StyledTextField from '../../../common/StyledTextfield';
import { ServerTypes, serverValidation } from '../../../constants/servers';
import useDidUpdate from '../../../customHooks/useDidUpdate';
import UnsavedSnackBar from '../UnsavedSnackBar';
import { useSnackbarValues } from '../SnackbarProvider';
import { isEmpty } from '../../../utils/validators';
import { updateServerRequested } from '../../../redux/actions/servers';
import { getUpdateServerData } from '../../../redux/reducers';
import StyledImage from '../../../common/StyledImage';
import { MAX_FILE_SIZE } from '../../../constants/Message';

const isValueChanged = (prevValue, newValue) => {
  // check if prevValue and newValue are both falsy then nothing changed
  if (!prevValue && !newValue) return false;
  return prevValue !== newValue;
};

const mapHtmlNamesToValues = {
  'new-server-avatar': 'avatar',
  'new-server-banner': 'banner',
};

// TODO: handle file uploads
const ServerOverview = (props) => {
  const {
    reset, setReset, setIsSnackbarOpen, isSnackbarOpen,
  } = useSnackbarValues();
  const { serverId } = useParams();
  const dispatch = useDispatch();

  const { isLoading, error } = useSelector(
    (state) => getUpdateServerData(state, serverId),
  ) || { isLoading: false, error: null };

  const { serverDetails } = useServerData(serverId, false);
  const {
    name,
    avatar,
    type,
    description,
    banner,
  } = serverDetails;

  const [serverName, setServerName] = useState(name);
  const [serverType, setServerType] = useState(type);
  const [serverDescription, setServerDescription] = useState(description ?? '');
  const [errors, setErrors] = useState({});
  const [filesObj, setFilesObj] = useState({});

  useDidUpdate(() => {
    if (reset) {
      setServerName(name);
      setServerType(type);
      setServerDescription(description ?? '');
      setErrors({});
      setReset(false);
      setFilesObj((prev) => {
        Object.values(prev).forEach((file) => {
          if (file?.fileUrl) URL.revokeObjectURL(file.fileUrl);
        });
        return {};
      });
    }
  }, [reset, name, type, description]);

  useDidUpdate(() => {
    // TODO: Handle socket update notification, or preserve saved server
    // details till this edit screen is open with useMemo hack
    // maybe will debounce if face any problems
    const debouncedFunc = () => {
      if (serverName !== name
        || serverType !== type
        || filesObj.avatar // if any of new banner or avatar present, something changed
        || filesObj.banner
        || isValueChanged(description, serverDescription)
      ) {
        setIsSnackbarOpen(true);
        return;
      }
      setIsSnackbarOpen(false);
    };
    debouncedFunc();

    return debouncedFunc.cancel;
  }, [serverName, serverType, serverDescription, name, type, description, filesObj]);

  const handleImageUpload = (e) => {
    const [currentFile] = e.target.files || e.nativeEvent?.target?.files;
    const { name: htmlName } = e.target;
    if (!currentFile || !htmlName) {
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
    const fileName = mapHtmlNamesToValues[htmlName];
    const newFileUrl = URL.createObjectURL(currentFile);

    setFilesObj((prev) => {
      const prevFileUrl = prev[fileName]?.fileUrl;
      if (prevFileUrl) URL.revokeObjectURL(prevFileUrl);
      return {
        ...prev,
        [fileName]: { originalFile: currentFile, fileUrl: newFileUrl },
      };
    });
  };

  const updateServerDetails = () => {
    const newErrorObj = {};
    if (!serverName?.trim()) {
      newErrorObj.serverName = 'Cannot be empty';
    } else if (serverName.length < serverValidation.SERVER_NAME_MIN_LENGTH) {
      newErrorObj.serverName = `Must be longer than or equal to ${serverValidation.SERVER_NAME_MIN_LENGTH} characters`;
    } else if (serverName.length > serverValidation.SERVER_NAME_MAX_LENGTH) {
      newErrorObj.serverName = `Must be smaller than or equal to ${serverValidation.SERVER_NAME_MAX_LENGTH} characters`;
    }

    if (serverDescription) {
      if (!serverDescription?.trim()) {
        newErrorObj.serverDescription = 'Cannot be only whitespace';
      } else if (serverDescription.length > serverValidation.SERVER_DESCRIPTION_MAX_LENGTH) {
        newErrorObj.serverDescription = `Must be smaller than or equal to ${serverValidation.SERVER_DESCRIPTION_MAX_LENGTH} characters`;
      }
    }

    if (!isEmpty(newErrorObj)) {
      setErrors(newErrorObj);
      return;
    }

    setErrors({});

    // TODO: add description, logo and banner
    const data = {
      name: serverName,
      type: serverType,
      description: serverDescription,
    };
    dispatch(updateServerRequested(serverId, data));
  };

  const avatarUrl = filesObj.avatar?.fileUrl || avatar;
  const bannerUrl = filesObj.banner?.fileUrl || banner;
  return (
    <>
      <OverviewContainer>
        <Box
          display="flex"
          flexWrap="wrap"
          gap={(theme) => theme.spacing(4)}
        >
          <Box
            display="flex"
            minWidth="250px"
            gap={(theme) => theme.spacing(2)}
            flex="1"
          >
            <AvatarContainer>
              <IconAvatar src={avatarUrl}>
                <Typography
                  variant="h6"
                  fontSize="2.5rem"
                >
                  {getCharacterName(name)}
                </Typography>
              </IconAvatar>
              {!!avatarUrl && (
                <Overlay>
                  <Typography textAlign="center" color="text.primary">
                    Update avatar
                  </Typography>
                </Overlay>
              )}
              <FileInput
                name="new-server-avatar"
                type="file"
                multiple={false}
                accept="image/*"
                onChange={handleImageUpload}
              />
            </AvatarContainer>
            <div>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                We recommend an image of at least 512x512 for the server.
              </Typography>
              <UploadButton
                variant="outlined"
              >
                <div>
                  Upload Image
                  <FileInput
                    name="new-server-avatar"
                    type="file"
                    multiple={false}
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </UploadButton>
            </div>
          </Box>

          <Box
            flex="1"
            display="flex"
            flexDirection="column"
            gap={(theme) => theme.spacing(2)}
            minWidth="250px"
          >
            <div>
              <StyledTextField
                label={(
                  <Typography
                    variant="caption"
                    color={errors.serverName ? 'error.light' : 'text.secondary'}
                    component="span"
                    fontWeight="fontWeightBold"
                  >
                    SERVER NAME
                  </Typography>
                )}
                id="edit-server-name"
                isError={!!errors.serverName}
                errorMessage={errors.serverName}
                minLength={serverValidation.SERVER_NAME_MIN_LENGTH}
                maxLength={serverValidation.SERVER_NAME_MAX_LENGTH}
                injectCss={(theme) => `margin-top: ${theme.spacing(1)};`}
                onKeyDown={stopPropagation} // to prevent weired error of losing focus on typing s
                autoComplete="off"
                value={serverName}
                onChange={({ target: { value } }) => {
                  setServerName(value);
                }}
              />
            </div>
            <div>
              <Typography
                variant="caption"
                color={errors.serverType ? 'error.light' : 'text.secondary'}
                component="span"
                fontWeight="fontWeightBold"
              >
                SERVER TYPE
              </Typography>
              <TypeSelect
                labelId="server-type"
                value={serverType}
                onChange={({ target: { value } }) => setServerType(value)}
                displayEmpty
                inputProps={{ 'aria-label': 'Server type' }}
              >
                {Object.entries(ServerTypes).map(([title, value]) => (
                  <MenuItem key={value} value={value}>{title}</MenuItem>
                ))}
              </TypeSelect>
            </div>

            <div>
              <StyledTextField
                id="edit-server-description"
                label={(
                  <Typography
                    variant="caption"
                    color={errors.serverDescription ? 'error.light' : 'text.secondary'}
                    component="span"
                    fontWeight="fontWeightBold"
                  >
                    SERVER DESCRIPTION
                  </Typography>
                )}
                value={serverDescription}
                onChange={({ target }) => setServerDescription(target.value)}
                isError={!!errors.serverDescription}
                errorMessage={errors.serverDescription}
                maxLength={serverValidation.SERVER_DESCRIPTION_MAX_LENGTH}
                as="textarea"
                rows={4}
                onKeyDown={stopPropagation} // to prevent weired error of losing focus on typing s
                injectCss={(theme) => `margin-top: ${theme.spacing(1)};
                  textarea { resize: none; }
                `}
              />
            </div>
          </Box>
        </Box>
        <Divider sx={{ backgroundColor: 'text.secondaryDark' }} />

        <Box
          gap={(theme) => theme.spacing(4)}
          display="flex"
          flexWrap="wrap"
          marginBottom={isSnackbarOpen ? '50px' : ''}
        >
          <Box flex="1">
            <Typography margin="0 0 10px" color="text.secondary">
              Server banner background
            </Typography>

            <Typography component="p" margin="0 0 10px" color="text.secondaryDark" variant="body2">
              This image will display at the top of your channels list.
            </Typography>

            <Typography margin="0 0 10px" color="text.secondaryDark" variant="body2">
              The recommended minimum size is 960x540 and recommended aspect ratio is 16:9
            </Typography>
          </Box>

          <Box flex="1">
            <EmptyBanner>
              {bannerUrl ? (
                <>
                  <StyledImage
                    width="100%"
                    height="100%"
                    objectFit="cover"
                    src={bannerUrl}
                  />
                  <Overlay>
                    <Typography textAlign="center" color="text.primary">
                      Update banner
                    </Typography>
                  </Overlay>
                </>
              ) : (
                <UploadBannerWrapper>
                  <StyledCloudIcon />
                  <Typography color="text.secondary">
                    Upload Banner
                  </Typography>
                </UploadBannerWrapper>
              )}
              <FileInput
                name="new-server-banner"
                type="file"
                accept="image/*"
                multiple={false}
                onChange={handleImageUpload}
              />
            </EmptyBanner>
          </Box>
        </Box>
      </OverviewContainer>
      <UnsavedSnackBar handleSubmit={updateServerDetails} isSubmitting={isLoading} />
    </>
  );
};

ServerOverview.propTypes = {
};

export default ServerOverview;
