import { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import StyledTextfield from '../../../common/StyledTextfield';
import { Anchor, InputWrapper } from '../styles';

const Signup = (props) => {
  const { switchScreen } = props;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
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
            label="EMAIL"
            id="signup email"
            type="email"
            value={email}
            onChange={({ target: { value } }) => setEmail(value)}
          />
        </InputWrapper>

        <InputWrapper>
          <StyledTextfield
            label="NAME"
            id="signup name"
            type="text"
            value={name}
            onChange={({ target: { value } }) => setName(value)}
          />
        </InputWrapper>

        <InputWrapper>
          <StyledTextfield
            label="PASSWORD"
            id="signup password"
            type="password"
            value={password}
            onChange={({ target: { value } }) => setPassword(value)}
          />
        </InputWrapper>

        <Button type="submit" color="primary" variant="contained">
          Continue
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
