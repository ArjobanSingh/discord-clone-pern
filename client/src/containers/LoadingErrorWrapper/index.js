import PropTypes from 'prop-types';

const LoadingErrorWrapper = (props) => {
  const {
    children, isLoading, isError, loader, errorUi,
  } = props;

  if (isError) return errorUi;
  if (isLoading) return loader;
  return children;
};

LoadingErrorWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  loader: PropTypes.node.isRequired,
  errorUi: PropTypes.node.isRequired,
};

export default LoadingErrorWrapper;
