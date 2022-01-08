import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import LoadingErrorWrapper from '../../containers/LoadingErrorWrapper';
import { serverDetailsRequested } from '../../redux/actions/servers';
// import useDidUpdate from '../../customHooks/useDidUpdate';

// this component will only render, after we have fetched user details and server list
const Server = (props) => {
  const params = useParams();
  const dispatch = useDispatch();
  const serverDetails = useSelector((state) => state.servers[params.serverId]);

  console.log('params', params);

  useEffect(() => {
    if (serverDetails) {
      if (!serverDetails.members && !serverDetails.isFetchingData) {
        // if members not present or not yet fetching server details, fetch server details
        dispatch(serverDetailsRequested(serverDetails.serverId));
      }
    }
  }, [serverDetails]);

  // TODO: server-details fetched, push to channel route
  // useDidUpdate(() => {
  //   if (serverDetails?.isServerDetailsFetched) {
  //     let channelRoute = params.channelId;
  //     if (!channelRoute) {
  //       [channelRoute] = serverDetails.channels;
  //     }
  //   }
  // }, [serverDetails?.isServerDetailsFetched, params.channelId]);

  if (!serverDetails) {
    return (
      <div>No server found: 404</div>
    );
  }

  return (
    <LoadingErrorWrapper
      isError={!!serverDetails.error}
      errorUi={<div>Server fetch error</div>}
      isLoading={serverDetails.isFetchingData && !serverDetails.members}
      loader={<div>Server Loading...</div>}
    >
      <div>
        Single Server
        <Outlet />
      </div>
    </LoadingErrorWrapper>
  );
};

Server.propTypes = {

};

export default Server;
