import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Skeleton from '@mui/material/Skeleton';
import { ServerIconList, SidebarContainer } from '../../components/AllServersDrawer/styles';
import { ChannelListContainer } from '../../components/ChannelList/styles';
import ChannelListLoader from '../../components/ChannelList/ChannelListLoader';

const ServersListLoading = (props) => (
  <SidebarContainer>
    <ServerIconList>
      {[1, 2, 3, 4, 5, 6, 7].map((it) => (
        <Skeleton variant="circular" key={it} width="50px" height="50px" />
      ))}
    </ServerIconList>
    <ChannelListContainer>
      <ChannelListLoader />
    </ChannelListContainer>
  </SidebarContainer>
);

ServersListLoading.propTypes = {

};

export default ServersListLoading;
