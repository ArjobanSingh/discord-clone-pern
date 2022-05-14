// import PropTypes from 'prop-types';
import {
  Navigate, Outlet, useNavigate, useOutletContext, useParams,
} from 'react-router-dom';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEffect, useMemo, useState } from 'react';
import useServerData from '../../customHooks/useServerData';
import {
  InnerServerContainer, MainServerContent, PreviewBar, StyledButton,
} from './styles';
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
    isExploringServer,
    isMembersDrawerOpen,
    members: serverDetails.members,
  }), [isMembersDrawerOpen, serverDetails.members, isExploringServer]);

  const goBack = () => {
    navigate('/guild-discovery');
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

  const serverHeaderUi = (isEmptyChannels) => (
    <ServerHeader
      name={openedChannel.name}
      openServerListDrawer={openServerListDrawer}
      openMembersDrawer={isEmptyChannels ? undefined : toggleDrawer}
    />
  );

  if (serverDetails.error) return <div>{serverDetails.error.message}</div>;
  if (serverDetails.isFetchingData || !serverDetails.members) return <div>Server Loading...</div>;

  if (isEmpty(channels)) {
    return (
      <InnerServerContainer>
        {previewBarUI}
        {serverHeaderUi(true)}
        <MainServerContent>
          <NoChannels setOpenedChannel={setOpenedChannel} />
        </MainServerContent>
      </InnerServerContainer>
    );
  }

  const [{ id: fistChannelId }] = channels;

  if (params.channelId) {
    return (
      <InnerServerContainer>
        {previewBarUI}
        {serverHeaderUi(false)}
        <MainServerContent>
          <Outlet context={outletContextValue} />
        </MainServerContent>
      </InnerServerContainer>
    );
  }

  return <Navigate replace to={`/channels/${serverDetails.id}/${fistChannelId}`} />;
};

Server.propTypes = {

};

export default Server;
