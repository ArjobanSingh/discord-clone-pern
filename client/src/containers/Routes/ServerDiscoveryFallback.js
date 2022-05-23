// import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ServersAvatarLoader } from '../Servers/ServersListLoading';
import ServerDiscoveryLoader from '../../components/ServerDiscovery/ServerDiscoveryLoader';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const ListContainer = styled.div`
  display: none;

  ${({ theme }) => theme.breakpoints.up('sm')} {
    display: block;
  };
`;

const ContentContainer = styled.div`
  flex: 1;
`;

const ServerDiscoveryFallback = () => (
  <Container>
    <ListContainer><ServersAvatarLoader /></ListContainer>
    <ContentContainer><ServerDiscoveryLoader /></ContentContainer>
  </Container>
);

ServerDiscoveryFallback.propTypes = {

};

export default ServerDiscoveryFallback;
