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
    return { hasError: true, loadingChunkError: isLoadingChunkError };
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
      try {
        this.setState({ isReloadingChunk: true });
        await reloadChunk();
        this.setState({ hasError: false, loadingChunkError: false, isReloadingChunk: false });
      } catch (err) {
        this.setState({ isReloadingChunk: false });
        console.log('reloading error', err);
      }
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
