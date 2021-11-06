import PropTypes from 'prop-types';

const Signup = (props) => {
  const { switchScreen } = props;
  return (
    <>
      Signup
    </>
  );
};

Signup.propTypes = {
  switchScreen: PropTypes.func.isRequired,
};

export default Signup;
