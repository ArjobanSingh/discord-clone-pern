// import PropTypes from 'prop-types';
import {
  Navigate, Outlet, useNavigate, useOutletContext, useParams,
} from 'react-router-dom';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useMemo } from 'react';
import useServerData from '../../customHooks/useServerData';
import { PreviewBar, ServerContainer, StyledButton } from './styles';
import JoinPublicServer from './JoinPublicServer';
import ServerHeader from '../ServerHeader';
import useMobileDrawerState from '../../customHooks/useMobileDrawerState';

const dummyChannels = [{ channelId: 'first-channel-id' }];

// this component will only render, after we have fetched user details and server list
const Server = (props) => {
  const params = useParams();
  const navigate = useNavigate();
  const openServerListDrawer = useOutletContext();

  const {
    mobileOpen: isMembersDrawerOpen,
    openDrawer: openMembersDrawer,
    closeDrawer: closeMembersDrawer,
  } = useMobileDrawerState();

  const outletContextValue = useMemo(() => ({
    closeMembersDrawer,
    isMembersDrawerOpen,
  }), [isMembersDrawerOpen, closeMembersDrawer]);

  const { serverDetails, noServerFound, isExploringServer } = useServerData(params.serverId, true);

  if (noServerFound) {
    return (
      <div>No server found: 404</div>
    );
  }

  const goBack = () => {
    navigate(-1);
  };

  // TODO: use real channels data, and remove this default dummyChannels
  const { channels: [{ channelId: fistChannelId }] = dummyChannels } = serverDetails;

  if (serverDetails.error) return <div>{serverDetails.error.message}</div>;
  if (serverDetails.isFetchingData || !serverDetails.members) return <div>Server Loading...</div>;
  if (params.channelId) {
    return (
      <ServerContainer>
        {isExploringServer && (
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
        )}
        <ServerHeader
          serverName={serverDetails.name}
          openServerListDrawer={openServerListDrawer}
          openMembersDrawer={openMembersDrawer}
        />
        <Outlet context={outletContextValue} />
      </ServerContainer>
    );
  }
  return <Navigate replace to={`/channels/${serverDetails.id}/${fistChannelId}`} />;
};

Server.propTypes = {

};

export default Server;
