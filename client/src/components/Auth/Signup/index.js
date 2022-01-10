import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import StyledTextfield from '../../../common/StyledTextfield';
import { Anchor, InputWrapper } from '../styles';
import { isEmailValid, isEmpty, isEmptyString } from '../../../utils/validators';
import Error from '../../../common/Error';
import DotLoader from '../../../common/DotLoader';
import useAuthState from '../../../customHooks/useAuthState';
import { registrationRequested } from '../../../redux/actions/auth';

const Signup = (props) => {
  const { switchScreen } = props;
  const dispatch = useDispatch();

  const { isLoading, errors, setErrors } = useAuthState((state) => state.auth.register);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');
    const name = formData.get('name');

    const newErrors = {};

    if (isEmptyString(email)) newErrors.email = 'This field is required';
    else if (!isEmailValid(email)) newErrors.email = 'Please enter a valid email';

    if (isEmptyString(password)) newErrors.password = 'This field is required';
    else if (password.length <= 3) newErrors.password = 'Should be greater than 3 characters';

    if (isEmptyString(name)) newErrors.name = 'This field is required';
    else if (name.length <= 3) newErrors.name = 'Should be greater than 3 characters';

    if (!isEmpty(newErrors)) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    dispatch(registrationRequested({ email, password, name }));
  };

  const openLogin = (e) => {
    e.preventDefault();
    switchScreen();
  };

  return (
    <>
      <Typography
        variant="h1"
        color="text.primary"
        fontSize="h5.fontSize"
        fontWeight="fontWeightBold"
        marginBottom={1}
      >
        Create an account
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
            id="signup email"
            type="email"
            name="email"
            isError={!!errors.email || !!errors.message}
            errorMessage={errors.email}
            autoComplete="email"
          />
        </InputWrapper>

        <InputWrapper>
          <StyledTextfield
            label={(
              <Typography
                variant="body2"
                color={!!errors.name || !!errors.message ? 'error.light' : 'text.secondary'}
                component="span"
              >
                NAME
              </Typography>
            )}
            id="signup name"
            type="text"
            name="name"
            isError={!!errors.name || !!errors.message}
            errorMessage={errors.name}
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
            id="signup password"
            type="password"
            name="password"
            isError={!!errors.password || !!errors.message}
            errorMessage={errors.password}
            autoComplete="new-password"
          />
        </InputWrapper>

        {!!errors.message && <Error>{errors.message}</Error>}

        <Button type="submit" color="primary" variant="contained">
          <Typography variant="body2" visibility={isLoading ? 'hidden' : ''}>Continue</Typography>
          {isLoading && <DotLoader />}
        </Button>
      </Box>
      <Typography
        variant="body2"
        color="#72767d"
        width="100%"
        marginTop={(theme) => theme.spacing(1)}
      >
        <Anchor href="#" onClick={openLogin}>
          Already have an account?
        </Anchor>
      </Typography>
    </>
  );
};

Signup.propTypes = {
  switchScreen: PropTypes.func.isRequired,
};

export default Signup;
