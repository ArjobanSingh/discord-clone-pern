// import PropTypes from 'prop-types';
import {
  Navigate, Outlet, useNavigate, useOutletContext, useParams,
} from 'react-router-dom';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useMemo, useState } from 'react';
import useServerData from '../../customHooks/useServerData';
import {
  InnerServerContainer, MainServerContent, PreviewBar, StyledButton,
} from './styles';
import JoinPublicServer from './JoinPublicServer';
import ServerHeader from '../ServerHeader';
import { isEmpty } from '../../utils/validators';
import NoChannels from '../NoChannels';
import NotFound from '../NotFound';
import ApiError from '../../common/ApiError';
import ServerLoader from './ServerLoader';

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

  const {
    serverDetails,
    noServerFound,
    isExploringServer,
    retryServerData,
  } = useServerData(params.serverId, true);

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

  const renderServerHeader = () => (
    <ServerHeader
      name={openedChannel.name}
      openServerListDrawer={openServerListDrawer}
      openMembersDrawer={toggleDrawer}
    />
  );

  const renderPreviewBar = () => isExploringServer && (
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

  if (noServerFound) return <NotFound />;

  const { channels } = serverDetails;

  if (serverDetails.error) {
    return (
      <ApiError
        errorDescription="Not able to get server details, Please try again later"
        error={serverDetails.error?.message}
        retry={retryServerData}
      />
    );
  }

  if (serverDetails.isFetchingData || !serverDetails.members) {
    return <ServerLoader openServerListDrawer={openServerListDrawer} />;
  }

  if (isEmpty(channels)) {
    return (
      <InnerServerContainer>
        {renderPreviewBar()}
        {renderServerHeader()}
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
        {renderPreviewBar()}
        {renderServerHeader()}
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
