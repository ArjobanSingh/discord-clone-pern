import { Component } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import ApiError from '../../common/ApiError';

class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      loadingChunkError: false,
    //   isReloadingChunk: false,
    };
    this.retry = this.retry.bind(this);
  }

  static getDerivedStateFromError(error) {
    console.log('Route Error', error.message);
    const lowercaseError = error.message?.toLowerCase() || '';

    const isLoadingChunkError = ['loading', 'chunk', 'failed']
      .every((it) => lowercaseError.includes(it));
    return { hasError: true, loadingChunkError: isLoadingChunkError };
  }

  componentDidCatch(error, errorInfo) {}

  retry() {
    const { loadingChunkError } = this.state;
    // const { reloadChunk, navigate, location } = this.props;
    const isOnline = window.navigator.onLine;

    if (!isOnline) {
      toast.error('Network Error: Please check your internet connection');
      return;
    }

    window.location.reload();

    // TODO: logic to load only current chunk
    // if (loadingChunkError) {
    //   try {
    //     this.setState({ isReloadingChunk: true });
    //     const res = await reloadChunk();
    //     this.setState({ isReloadingChunk: false });
    //     navigate(location.pathname, { replace: true });
    //     console.log('location', location, res);
    //   } catch (err) {
    //     console.log('err failed again', err);
    //     this.setState({ hasError: true, isReloadingChunk: false });
    //   }
    // } else {
    //   console.log('why here');
    //   // some unexpected error occured, refresh app
    // //   window.location.reload();
    // }
  }

  render() {
    const { hasError } = this.state; // isReloadingChunk
    const { children } = this.props; // fallback
    const isOnline = window.navigator.onLine;

    const error = !isOnline
      ? 'Network Error! Please check your internet connection'
      : undefined;

    if (hasError) {
    //   if (isReloadingChunk) return fallback;

      return (
        <>
          <ApiError
            errorDescription="Not able to load this resource, please retry"
            error={error}
            retry={this.retry}
          />
        </>
      );
    }
    return children;
  }
}

RouteErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
//   reloadChunk: PropTypes.func.isRequired,
//   navigate: PropTypes.func.isRequired,
//   fallback: PropTypes.node.isRequired,
//   location: PropTypes.shape({
//     pathname: PropTypes.string.isRequired,
//   }).isRequired,
};

export default RouteErrorBoundary;
