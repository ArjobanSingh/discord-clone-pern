import { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import StyledTextfield from '../../../common/StyledTextfield';
import { Anchor, InputWrapper } from '../styles';
import { isEmailValid, isEmpty, isEmptyString } from '../../../utils/validators';
import { signInRequested } from '../../../redux/actions/auth';
import DotLoader from '../../../common/DotLoader';
import useDidUpdate from '../../../customHooks/useDidUpdate';
import Error from '../../../common/Error';

const Login = (props) => {
  const { switchScreen, isLoading, error: apiErrors } = props;
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  useDidUpdate(() => {
    if (!isEmpty(apiErrors)) setErrors(apiErrors);
  }, [apiErrors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (isEmptyString(email)) newErrors.email = 'This field is required';
    else if (!isEmailValid(email)) newErrors.email = 'Please enter a valid email';

    if (isEmptyString(password)) newErrors.password = 'This field is required';

    if (!isEmpty(newErrors)) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    dispatch(signInRequested({ email, password }));
  };

  const openRegistration = (e) => {
    e.preventDefault();
    switchScreen();
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
            label="EMAIL"
            id="login email"
            type="email"
            value={email}
            required
            onChange={({ target: { value } }) => setEmail(value)}
            isError={!!errors.email || !!errors.message}
            errorMessage={errors.email}
          />
        </InputWrapper>

        <InputWrapper>
          <StyledTextfield
            label="PASSWORD"
            id="login password"
            type="password"
            value={password}
            required
            onChange={({ target: { value } }) => setPassword(value)}
            isError={!!errors.password || !!errors.message}
            errorMessage={errors.password}
          />
        </InputWrapper>

        {!!errors.message && <Error>{errors.message}</Error>}

        <Button type="submit" color="primary" variant="contained">
          <Typography variant="body2" visibility={isLoading ? 'hidden' : ''}>Login</Typography>
          {isLoading && <DotLoader />}
        </Button>
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
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.objectOf(PropTypes.string),
};

Login.defaultProps = {
  error: null,
};

export default Login;
