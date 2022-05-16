import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { IconWrapper, InviteModalContainer, StyledSelect } from './styles';
import StyledTextfield from '../../common/StyledTextfield';
import { expirationOptions, sevenDaysInMinutes } from '../../constants/inviteUrl';
import axiosInstance from '../../utils/axiosConfig';
import { InviteApi } from '../../utils/apiEndpoints';
import { saveUrl } from '../../redux/actions/servers';
import { handleError } from '../../utils/helperFunctions';
import useIsMounted from '../../customHooks/useIsMounted';

const readOnlyHandler = () => {};

const InviteModal = (props) => {
  const { closeModal, inviteUrls, serverId } = props;
  const dispatch = useDispatch();
  const isMounted = useIsMounted();

  const [expirationLimit, setExpirationLimit] = useState(sevenDaysInMinutes);
  const [joinUrl, setJoinUrl] = useState('');
  const [isFetchError, setIsFetchError] = useState(false);

  // simple api request, easy to do here, than in redux-saga
  const getUrl = async () => {
    try {
      setJoinUrl('Fetching Url...');
      setIsFetchError(false);
      const payload = { serverId, minutes: expirationLimit };
      const response = await axiosInstance.post(InviteApi.CREATE_INVITE_URL, payload);
      dispatch(saveUrl(response.data));
    } catch (err) {
      // This will automatically prevent showing error, if Invite Modal
      // is reopened in another server before first server's invite api responds
      if (isMounted.current) {
        const sessionExpireError = handleError(err, (error) => {
          setIsFetchError(true);
          setJoinUrl(error.message || 'Something went wrong');

          // explicitly undefined, just for readibility
          return undefined;
        });
        if (sessionExpireError) dispatch(sessionExpireError);
      }
    }
  };

  useEffect(() => {
    const savedUrl = inviteUrls[expirationLimit];
    if (savedUrl && new Date(savedUrl.expireAt) > Date.now()) {
      // valid and not expired url present for this limit
      setJoinUrl(savedUrl.inviteUrl);
      return;
    }
    getUrl();
  }, [inviteUrls, expirationLimit, serverId, dispatch]);

  const handleLimitChange = ({ target: { value } }) => {
    setExpirationLimit(value);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(joinUrl).then(() => {
      console.log('copied');
    }, () => {
      console.log('copy failed');
    });
  };

  return (
    <InviteModalContainer>
      <IconWrapper onClick={closeModal}>
        <CloseIcon />
      </IconWrapper>
      <Box
        display="flex"
        flexDirection="column"
        gap="20px"
      >
        <Typography
          id="invite-modal-title"
          component="h2"
          variant="body1"
          fontWeight={{ sm: 'fontWeightBold', textTransform: 'uppercase' }}
        >
          Invite friends to New Server
        </Typography>

        <div>
          <Typography
            component="label"
            variant="caption"
            id="expiration-limit"
            fontWeight="fontWeightBold"
            color="text.secondaryDark"
          >
            EXPIRE AFTER
          </Typography>
          <StyledSelect
            labelId="expiration-limit"
            value={expirationLimit}
            onChange={handleLimitChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Expiration limit' }}
          >
            {Object.entries(expirationOptions).map(([title, value]) => (
              <MenuItem key={value} value={value}>{title}</MenuItem>
            ))}
          </StyledSelect>
        </div>

        <div>
          <StyledTextfield
            label={(
              <Typography
                component="label"
                variant="caption"
                id="expiration-limit"
                fontWeight="fontWeightBold"
                color="text.secondaryDark"
              >
                SEND A SERVER INVITE LINK TO A FRIEND
              </Typography>
            )}
            id="join-url-input"
            value={joinUrl}
            onChange={readOnlyHandler}
            endIcon={isFetchError ? (
              <Button
                type="submit"
                color="error"
                variant="contained"
                size="small"
                onClick={getUrl}
              >
                Retry
              </Button>
            ) : (
              <Button
                type="submit"
                color="primary"
                variant="contained"
                size="small"
                onClick={copyUrl}
              >
                Copy
              </Button>
            )}
            injectCss={(theme) => `
              height: 41px;
              padding-block: ${theme.spacing(0.5)};

              &:focus-within {
                border: 1px solid ${theme.palette.primary.main};
              }
          `}
          />
        </div>
      </Box>
    </InviteModalContainer>
  );
};

InviteModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  inviteUrls: PropTypes.objectOf(PropTypes.object).isRequired,
  serverId: PropTypes.string.isRequired,
};

export default InviteModal;
