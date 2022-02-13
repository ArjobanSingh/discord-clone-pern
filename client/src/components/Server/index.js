// import PropTypes from 'prop-types';
import {
  Navigate, Outlet, useNavigate, useOutletContext, useParams,
} from 'react-router-dom';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useMemo, useState } from 'react';
import useServerData from '../../customHooks/useServerData';
import { PreviewBar, StyledButton } from './styles';
import JoinPublicServer from './JoinPublicServer';
import ServerHeader from '../ServerHeader';
import { isEmpty } from '../../utils/validators';
import NoChannels from '../NoChannels';

// this component will only render, after we have fetched user details and server list
const Server = (props) => {
  const params = useParams();
  const navigate = useNavigate();
  const openServerListDrawer = useOutletContext();

  const [isMembersDrawerOpen, setIsMembersDrawerOpen] = useState(false);
  const [openedChannel, setOpenedChannel] = useState({});

  const toggleDrawer = () => {
    setIsMembersDrawerOpen((prev) => !prev);
  };

  const { serverDetails, noServerFound, isExploringServer } = useServerData(params.serverId, true);

  const outletContextValue = useMemo(() => ({
    closeMembersDrawer: () => { setIsMembersDrawerOpen(false); },
    setOpenedChannel,
    isMembersDrawerOpen,
    members: serverDetails.members,
  }), [isMembersDrawerOpen, serverDetails.members]);

  const goBack = () => {
    navigate(-1);
  };

  if (noServerFound) {
    return (
      <div>No server found: 404</div>
    );
  }

  const { channels } = serverDetails;

  const previewBarUI = isExploringServer && (
  <PreviewBar>
    <StyledButton
      variant="outlined"
      size="small"
      back="true"
      startIcon={<ArrowBackIcon />}
      onClick={goBack}
    >
      Back
    </StyledButton>

    <Typography
      variant="subtitle2"
      color="text.primary"
      lineHeight="normal"
    >
      You are currently in preview mode. Join this server to start chatting
    </Typography>
    <JoinPublicServer
      server={serverDetails}
    />
  </PreviewBar>
  );

  const serverHeaderUi = (
    <ServerHeader
      name={openedChannel.name}
      openServerListDrawer={openServerListDrawer}
      openMembersDrawer={toggleDrawer}
    />
  );

  if (serverDetails.error) return <div>{serverDetails.error.message}</div>;
  if (serverDetails.isFetchingData || !serverDetails.members) return <div>Server Loading...</div>;

  if (isEmpty(channels)) {
    return (
      <>
        {previewBarUI}
        {serverHeaderUi}
        <NoChannels setOpenedChannel={setOpenedChannel} />
      </>
    );
  }

  const [{ id: fistChannelId }] = channels;

  if (params.channelId) {
    return (
      <>
        {previewBarUI}
        {serverHeaderUi}
        <Outlet context={outletContextValue} />
      </>
    );
  }

  return <Navigate replace to={`/channels/${serverDetails.id}/${fistChannelId}`} />;
};

Server.propTypes = {

};

export default Server;
