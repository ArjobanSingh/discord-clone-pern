// import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { serverDetailsRequested } from '../../redux/actions/servers';
import { getServerDetails } from '../../redux/reducers';

const dummyChannels = [{ channelId: 'first-channel-id' }];

// this component will only render, after we have fetched user details and server list
const Server = (props) => {
  const params = useParams();
  const dispatch = useDispatch();
  const serverDetails = useSelector((state) => getServerDetails(state, params.serverId));

  useEffect(() => {
    if (serverDetails) {
      if (!serverDetails.members && !serverDetails.isFetchingData) {
        // if members not present or not yet fetching server details, fetch server details
        dispatch(serverDetailsRequested(serverDetails.id));
      }
    }
    // server not in user servers, means either no such server or user is checking any public server
  }, [serverDetails]);

  if (!serverDetails) {
    return (
      <div>No server found: 404</div>
    );
  }

  // TODO: use real channels data, and remove this default dummyChannels
  const { channels: [{ channelId: fistChannelId }] = dummyChannels } = serverDetails;

  if (serverDetails.error) return <div>Server fetch error</div>;
  if (serverDetails.isFetchingData || !serverDetails.members) return <div>Server Loading...</div>;
  if (params.channelId) return <Outlet />;
  return <Navigate replace to={`/channels/${serverDetails.id}/${fistChannelId}`} />;
};

Server.propTypes = {

};

export default Server;
