import { useState } from 'react';
// import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import StyledImage from '../../common/StyledImage';
import { MAIN_BACKGROUND } from '../../constants/images';
import { LOGIN_SCREEN, SIGNUP_SCREEN } from '../../constants/auth';
import Login from './Login';
import Signup from './Signup';

const Auth = () => {
  const [currentScreen, setCurrentScreen] = useState(LOGIN_SCREEN);

  const switchScreen = () => {
    setCurrentScreen((prev) => (prev === LOGIN_SCREEN ? SIGNUP_SCREEN : LOGIN_SCREEN));
  };

  const Component = currentScreen === LOGIN_SCREEN ? Login : Signup;

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
            <Component
              switchScreen={switchScreen}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

Auth.propTypes = {

};

export default Auth;
