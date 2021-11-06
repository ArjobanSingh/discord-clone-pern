import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

const Login = (props) => {
  const { switchScreen } = props;
  return (
    <>
      <Typography
        variant="h1"
        color="text.primary"
        fontSize="h5.fontSize"
      >
        Welcome back!
      </Typography>
    </>
  );
};

Login.propTypes = {
  switchScreen: PropTypes.func.isRequired,
};

export default Login;
