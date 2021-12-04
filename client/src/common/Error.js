import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

const Error = ({ children, ...rest }) => (
  <Typography
    variant="caption"
    color="error.light"
    fontStyle="italic"
    fontWeight="600"
    {...rest}
  >
    {children}
  </Typography>
);

Error.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Error;
