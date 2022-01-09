// import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import LoadingErrorWrapper from '../../containers/LoadingErrorWrapper';
import { serverDetailsRequested } from '../../redux/actions/servers';

const dummyChannels = [{ channelId: 'first-channel-id' }];

// this component will only render, after we have fetched user details and server list
const Server = (props) => {
  const params = useParams();
  const dispatch = useDispatch();
  const serverDetails = useSelector((state) => state.servers[params.serverId]);

  useEffect(() => {
    if (serverDetails) {
      if (!serverDetails.members && !serverDetails.isFetchingData) {
        // if members not present or not yet fetching server details, fetch server details
        dispatch(serverDetailsRequested(serverDetails.id));
      }
    }
  }, [serverDetails]);

  if (!serverDetails) {
    return (
      <div>No server found: 404</div>
    );
  }

  // TODO: use real channels data, and remove this default dummyChannels
  const { channels: [{ channelId: fistChannelId }] = dummyChannels } = serverDetails;

  return (
    <LoadingErrorWrapper
      isError={!!serverDetails.error}
      errorUi={<div>Server fetch error</div>}
      isLoading={serverDetails.isFetchingData && !serverDetails.members}
      loader={<div>Server Loading...</div>}
    >
      {/* if user directly navigating to some channel open that channel,
        otherwise navigate user to first channel of opened server */}
      {params.channelId
        ? <Outlet />
        : <Navigate replace to={`/channels/${serverDetails.id}/${fistChannelId}`} />}

    </LoadingErrorWrapper>
  );
};

Server.propTypes = {

};

export default Server;
