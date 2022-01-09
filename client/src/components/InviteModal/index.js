import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { InviteModalContainer } from './styles';
import StyledTextfield from '../../common/StyledTextfield';

const readOnlyHandler = () => {};

const InviteModal = (props) => {
  const [joinUrl, setJoinUrl] = useState('https://join-url');

  return (
    <InviteModalContainer>
      <Box
        display="flex"
        flexDirection="column"
        gap="5px"
      >
        <Typography
          id="invite-modal-title"
          component="h2"
          variant="body1"
          fontWeight={{ sm: 'fontWeightBold' }}
        >
          SEND A SERVER INVITE LINK TO A FRIEND
        </Typography>

        <StyledTextfield
          label={null}
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
            padding-block: ${theme.spacing(0.5)};

            &:focus-within {
              border-color: ${theme.palette.primary.main};
            }
          `}
        />
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight="fontWeightLight"
        >
          Your invite link expires in 7 days.
        </Typography>
      </Box>
    </InviteModalContainer>
  );
};

InviteModal.propTypes = {

};

export default InviteModal;
