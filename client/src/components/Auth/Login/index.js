import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useState } from 'react';
import StyledTextfield from '../../../common/StyledTextfield';
import { Anchor, InputWrapper } from '../styles';
import { isEmailValid, isEmpty, isEmptyString } from '../../../utils/validators';
import { signInRequested } from '../../../redux/actions/auth';
import DotLoader from '../../../common/DotLoader';
import Error from '../../../common/Error';
import useAuthState from '../../../customHooks/useAuthState';
import { getLoginAuthState } from '../../../redux/reducers';

const guestButtonsSX = { flex: '1' };
const guestCredentials = {
  guest1: {
    email: 'guest1@mail.com',
    password: 'guest1test',
  },
  guest2: {
    email: 'guest2@mail.com',
    password: 'guest2test',
  },
};

const Login = (props) => {
  const { switchScreen } = props;
  const dispatch = useDispatch();
  const location = useLocation();

  const [loginCreds, setLoginCreds] = useState({
    email: '',
    password: '',
  });

  const { isLoading, errors, setErrors } = useAuthState((state) => getLoginAuthState(state));

  const handleSubmit = (e) => {
    e.preventDefault();
    // previous logic when i did not need controlled inputs
    // const formData = new FormData(e.currentTarget);
    // const email = formData.get('email');
    // const password = formData.get('password');

    const { email, password } = loginCreds;

    const newErrors = {};

    if (isEmptyString(email)) newErrors.email = 'This field is required';
    else if (!isEmailValid(email)) newErrors.email = 'Please enter a valid email';

    if (isEmptyString(password)) newErrors.password = 'This field is required';

    if (!isEmpty(newErrors)) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const from = location.state?.from?.pathname || '/';
    dispatch(signInRequested({ email, password }, from));
  };

  const openRegistration = (e) => {
    e.preventDefault();
    switchScreen();
  };

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setLoginCreds((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGuestCredentials = (e) => {
    if (isLoading) return;
    const { guest } = e.target?.closest?.('button').dataset;
    const guestCreds = guestCredentials[guest];
    setLoginCreds({ ...guestCreds });
  };

  return (
    <>
      <Typography
        variant="h1"
        color="text.primary"
        fontSize="h5.fontSize"
        width="100%"
        fontWeight="fontWeightBold"
        marginBottom={1}
      >
        Welcome back!
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        width="100%"
      >
        We re so excited to see you again!
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        marginTop={(theme) => theme.spacing(2)}
        display="flex"
        flexDirection="column"
        gap="0.875rem"
        width="100%"
      >
        <InputWrapper>
          <StyledTextfield
            label={(
              <Typography
                variant="body2"
                color={!!errors.email || !!errors.message ? 'error.light' : 'text.secondary'}
                component="span"
              >
                EMAIL
              </Typography>
           )}
            id="login email"
            type="email"
            name="email"
            isError={!!errors.email || !!errors.message}
            errorMessage={errors.email}
            autoComplete="email"
            value={loginCreds.email}
            onChange={onChangeInput}
          />
        </InputWrapper>

        <InputWrapper>
          <StyledTextfield
            label={(
              <Typography
                variant="body2"
                color={!!errors.password || !!errors.message ? 'error.light' : 'text.secondary'}
                component="span"
              >
                PASSWORD
              </Typography>
            )}
            id="login password"
            type="password"
            name="password"
            isError={!!errors.password || !!errors.message}
            errorMessage={errors.password}
            autoComplete="current-password"
            value={loginCreds.password}
            onChange={onChangeInput}
          />
        </InputWrapper>

        {!!errors.message && <Error>{errors.message}</Error>}

        <Button type="submit" color="primary" variant="contained">
          <Typography variant="body2" visibility={isLoading ? 'hidden' : ''}>Login</Typography>
          {isLoading && <DotLoader />}
        </Button>

        <Box display="flex" gap="1rem">
          <Button
            color="info"
            variant="contained"
            onClick={handleGuestCredentials}
            data-guest="guest1"
            sx={guestButtonsSX}
          >
            <Typography variant="body2">
              Use Guest 1 Credentials
            </Typography>
          </Button>

          <Button
            color="info"
            variant="contained"
            onClick={handleGuestCredentials}
            data-guest="guest2"
            sx={guestButtonsSX}
          >
            <Typography variant="body2">
              Use Guest 2 Credentials
            </Typography>
          </Button>
        </Box>
      </Box>
      <Typography
        variant="body2"
        color="#72767d"
        width="100%"
        marginTop={(theme) => theme.spacing(1)}
      >
        Need an account?
        {' '}
        <Anchor href="#" onClick={openRegistration}>
          Register
        </Anchor>
      </Typography>
    </>
  );
};

Login.propTypes = {
  switchScreen: PropTypes.func.isRequired,
};

export default Login;
