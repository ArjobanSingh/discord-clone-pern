import { useState } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
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
} from './styles';
import useServerData from '../../../customHooks/useServerData';
import { getCharacterName } from '../../../utils/helperFunctions';
import StyledTextField from '../../../common/StyledTextfield';
import { ServerTypes, serverValidation } from '../../../constants/servers';
import useDidUpdate from '../../../customHooks/useDidUpdate';
import UnsavedSnackBar from '../UnsavedSnackBar';
import { useSnackbarValues } from '../SnackbarProvider';
import { isEmpty } from '../../../utils/validators';
import { updateServerRequested } from '../../../redux/actions/servers';
import { getUpdateServerData } from '../../../redux/reducers';

// TODO: handle file uploads
const ServerOverview = (props) => {
  const { reset, setReset, setIsSnackbarOpen } = useSnackbarValues();
  const { serverId } = useParams();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector(
    (state) => getUpdateServerData(state, serverId),
  ) || { isLoading: false, error: null };

  const { serverDetails } = useServerData(serverId, false);
  const { name, avatar, type } = serverDetails;

  const [serverName, setServerName] = useState(name);
  const [serverType, setServerType] = useState(type);
  const [errors, setErrors] = useState({});

  useDidUpdate(() => {
    if (reset) {
      setServerName(name);
      setServerType(type);
      setErrors({});
      setReset(false);
    }
  }, [reset, name, type]);

  useDidUpdate(() => {
    // TODO: Handle socket update notification
    const debouncedFunc = debounce(() => {
      if (serverName !== name
        || serverType !== type) {
        setIsSnackbarOpen(true);
        return;
      }
      setIsSnackbarOpen(false);
    }, 300);
    debouncedFunc();

    return debouncedFunc.cancel;
  }, [serverName, serverType, name, type]);

  const handleImageUpload = () => {};

  const updateServerDetails = () => {
    const newErrorObj = {};
    if (!serverName?.trim()) {
      newErrorObj.serverName = 'Cannot be empty';
    } else if (serverName.length < serverValidation.SERVER_NAME_MIN_LENGTH) {
      newErrorObj.serverName = `Must be longer than or equal to ${serverValidation.SERVER_NAME_MIN_LENGTH} characters`;
    } else if (serverName.length > serverValidation.SERVER_NAME_MAX_LENGTH) {
      newErrorObj.serverName = `Must be smaller than or equal to ${serverValidation.SERVER_NAME_MAX_LENGTH} characters`;
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
    };
    dispatch(updateServerRequested(serverId, data));
  };

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
              <IconAvatar src={avatar}>
                <Typography
                  variant="h6"
                  fontSize="2.5rem"
                >
                  {getCharacterName(name)}
                </Typography>
              </IconAvatar>
              <FileInput type="file" accept="image/*" onChange={handleImageUpload} />
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
                  <FileInput type="file" accept="image/*" onChange={handleImageUpload} />
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
                id="server-name"
                name="server-name"
                isError={!!errors.serverName}
                errorMessage={errors.serverName}
                minLength={serverValidation.SERVER_NAME_MIN_LENGTH}
                maxLength={serverValidation.SERVER_NAME_MAX_LENGTH}
                injectCss={(theme) => `margin-top: ${theme.spacing(1)};`}
                onKeyDown={(e) => {
                  // to prevent weired error of losing focus on typing s
                  e.stopPropagation();
                }}
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
          </Box>

        </Box>
        <Divider sx={{ backgroundColor: 'text.secondaryDark' }} />
      </OverviewContainer>
      <UnsavedSnackBar handleSubmit={updateServerDetails} isSubmitting={isLoading} />
    </>
  );
};

ServerOverview.propTypes = {
};

export default ServerOverview;
