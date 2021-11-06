import { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import StyledImage from '../../common/StyledImage';
import { MAIN_BACKGROUND } from '../../constants/images';
import { LOGIN_SCREEN, SIGNUP_SCREEN } from '../../constants/auth';
import Login from './Login';
import Signup from './Signup';

const Auth = (props) => {
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
      >
        <Grid
          item
          xs={12}
          sm={10}
          md={8}
          lg={6}
          height={{ xs: '100%', sm: 'auto' }}
          backgroundColor="background.paper"
          padding={(theme) => theme.spacing(2)}
          borderRadius={1.25}
        >
          <Component switchScreen={switchScreen} />
        </Grid>
      </Grid>
    </>
  );
};

Auth.propTypes = {

};

export default Auth;
