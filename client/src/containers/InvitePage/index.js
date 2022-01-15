import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import StyledImage from '../../common/StyledImage';
import { MAIN_BACKGROUND } from '../../constants/images';
import Invite from '../../components/Invite';

const InvitePage = (props) => {
  const { inviteId } = useParams();
  return (
    <>
      <StyledImage
        src={MAIN_BACKGROUND}
        alt="main background"
        width="100%"
        height="100%"
        position="fixed"
      />
      <Grid
        container
        height="100%"
        position="relative"
        zIndex="10"
        justifyContent="center"
        alignItems="center"
        minHeight="580px"
      >
        <Grid
          item
          height={{ xs: '100%', sm: 'auto' }}
          width={{ xs: '100%', sm: '500px' }}
          minHeight="265px"
          backgroundColor="background.paper"
          padding={(theme) => theme.spacing(3)}
          borderRadius={{ xs: 0, sm: 1.25 }}
        >
          <Box
            marginTop={{ xs: '100px', sm: '0' }}
            width="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Invite inviteId={inviteId} />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

InvitePage.propTypes = {

};

export default InvitePage;
