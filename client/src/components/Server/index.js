// import PropTypes from 'prop-types';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import useServerData from '../../customHooks/useServerData';

const dummyChannels = [{ channelId: 'first-channel-id' }];

// this component will only render, after we have fetched user details and server list
const Server = (props) => {
  const params = useParams();
  const { serverDetails, noServerFound } = useServerData(params.serverId, true);

  if (noServerFound) {
    return (
      <div>No server found: 404</div>
    );
  }

  // TODO: use real channels data, and remove this default dummyChannels
  const { channels: [{ channelId: fistChannelId }] = dummyChannels } = serverDetails;

  if (serverDetails.error) return <div>{serverDetails.error.message}</div>;
  if (serverDetails.isFetchingData || !serverDetails.members) return <div>Server Loading...</div>;
  if (params.channelId) return <Outlet />;
  return <Navigate replace to={`/channels/${serverDetails.id}/${fistChannelId}`} />;
};

Server.propTypes = {

};

export default Server;
