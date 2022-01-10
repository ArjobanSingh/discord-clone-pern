import PropTypes from 'prop-types';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import { IconWrapper, InviteModalContainer, StyledSelect } from './styles';
import StyledTextfield from '../../common/StyledTextfield';
import { expirationOptions, sevenDaysInMinutes } from '../../constants/inviteUrl';

const readOnlyHandler = () => {};

const InviteModal = (props) => {
  const { closeModal } = props;
  const [expirationLimit, setExpirationLimit] = useState(sevenDaysInMinutes);
  const [joinUrl, setJoinUrl] = useState('https://join-url');

  const handleLimitChange = ({ target: { value } }) => {
    setExpirationLimit(value);
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
            endIcon={(
              <Button
                type="submit"
                color="primary"
                variant="contained"
                size="small"
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
};

export default InviteModal;
