// import PropTypes from 'prop-types';
import Skeleton from '@mui/material/Skeleton';
import { ServerIconList, SidebarContainer } from '../../components/AllServersDrawer/styles';
import { ChannelListContainer } from '../../components/ChannelList/styles';
import ChannelListLoader from '../../components/ChannelList/ChannelListLoader';

export const ServersAvatarLoader = () => (
  <ServerIconList>
    {[1, 2, 3, 4, 5, 6, 7].map((it) => (
      <Skeleton
        variant="circular"
        key={it}
        sx={{ minHeight: '50px' }}
        width="50px"
        height="50px"
      />
    ))}
  </ServerIconList>
);

const ServersListLoading = (props) => (
  <SidebarContainer borderRight="1px solid rgba(255,255,255,0.12)">
    <ServersAvatarLoader />
    <ChannelListContainer>
      <ChannelListLoader />
    </ChannelListContainer>
  </SidebarContainer>
);

ServersListLoading.propTypes = {

};

export default ServersListLoading;
