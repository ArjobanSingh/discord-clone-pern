// import PropTypes from 'prop-types';
import { DiscoveryContainer, ImageWrapper, Wrapper } from './styles';
import PublicServersLoader from '../PublicServersGrid/PublicServersLoader';
import { DISCOVER_SERVERS_BACKGROUND } from '../../constants/images';

const ServerDiscoveryLoader = () => (
  <Wrapper>
    <DiscoveryContainer>
      <ImageWrapper>
        <img height="100%" width="100%" src={DISCOVER_SERVERS_BACKGROUND} alt="explore servers" />
      </ImageWrapper>
      <PublicServersLoader />
    </DiscoveryContainer>
  </Wrapper>
);

ServerDiscoveryLoader.propTypes = {

};

export default ServerDiscoveryLoader;
