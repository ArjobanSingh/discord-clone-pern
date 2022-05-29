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
      isReloadingChunk: false,
    };
    this.retry = this.retry.bind(this);
  }

  static getDerivedStateFromError(error) {
    const lowercaseError = error.message?.toLowerCase() || '';

    const isLoadingChunkError = ['loading', 'chunk', 'failed']
      .every((it) => lowercaseError.includes(it));

    return {
      hasError: true,
      loadingChunkError: isLoadingChunkError,
      isReloadingChunk: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { children } = this.props;
    if (prevProps.children !== children) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState((prevState) => {
        if (prevState.loadingChunkError) {
          // children changed means, refetched again
          return {
            hasError: false, loadingChunkError: false, isReloadingChunk: false,
          };
        }
        return prevState;
      });
    }
  }

  componentDidCatch(error, errorInfo) {}

  async retry() {
    const { loadingChunkError } = this.state;
    const { reloadChunk } = this.props;
    const isOnline = window.navigator.onLine;

    if (!isOnline) {
      toast.error('Network Error: Please check your internet connection');
      return;
    }

    if (loadingChunkError) {
      this.setState({ isReloadingChunk: true });
      reloadChunk();
      return;
    }

    window.location.reloadChunk();
  }

  render() {
    const { hasError, isReloadingChunk } = this.state;
    const { children, fallback } = this.props;
    const isOnline = window.navigator.onLine;

    const error = !isOnline
      ? 'Network Error! Please check your internet connection'
      : undefined;

    if (hasError) {
      if (isReloadingChunk) return fallback;

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
  reloadChunk: PropTypes.func.isRequired,
  fallback: PropTypes.node.isRequired,
};

export default RouteErrorBoundary;
