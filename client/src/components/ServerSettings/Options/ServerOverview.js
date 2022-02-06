import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import { useParams } from 'react-router-dom';
import Divider from '@mui/material/Divider';
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
import { ServerTypes } from '../../../constants/servers';
import useDidUpdate from '../../../customHooks/useDidUpdate';
import UnsavedSnackBar from '../UnsavedSnackBar';
import { useSnackbarValues } from '../SnackbarProvider';

// TODO: handle file uploads
const ServerOverview = (props) => {
  const { reset, setReset, setIsSnackbarOpen } = useSnackbarValues();
  const { serverId } = useParams();
  const ref = useRef();

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

  const updateServerDetails = () => {};

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
              <IconAvatar src={avatar} onClick={() => { ref.current.click(); }}>
                <Typography
                  variant="h6"
                  fontSize="2.5rem"
                >
                  {getCharacterName(name)}
                </Typography>
              </IconAvatar>
              <FileInput ref={ref} type="file" accept="image/*" onChange={handleImageUpload} />
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
                  <FileInput ref={ref} type="file" accept="image/*" onChange={handleImageUpload} />
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
                labelId="expiration-limit"
                value={serverType}
                onChange={({ target: { value } }) => setServerType(value)}
                displayEmpty
                inputProps={{ 'aria-label': 'Expiration limit' }}
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
      <UnsavedSnackBar handleSubmit={updateServerDetails} />
    </>
  );
};

ServerOverview.propTypes = {
};

export default ServerOverview;
