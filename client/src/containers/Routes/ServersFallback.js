// import PropTypes from 'prop-types';
import styled from 'styled-components';
import ServersListLoading from '../Servers/ServersListLoading';
import ServerLoader from '../../components/Server/ServerLoader';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const ListContainer = styled.div`
  width: 320px;
`;

const ContentContainer = styled.div`
  flex: 1;
`;

const ServersFallback = () => (
  <Container>
    <ListContainer><ServersListLoading /></ListContainer>
    <ContentContainer><ServerLoader /></ContentContainer>
  </Container>
);

ServersFallback.propTypes = {

};

export default ServersFallback;
