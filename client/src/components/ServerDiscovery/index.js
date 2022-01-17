import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { FlexDiv } from '../../common/StyledComponents';
import { DISCOVER_SERVERS_BACKGROUND } from '../../constants/images';
import { getExploreServers } from '../../redux/reducers';
import { DiscoveryContainer } from './styles';

const ServerDiscovery = (props) => {
  const { data, error, loading } = useSelector(getExploreServers);

  return (
    <DiscoveryContainer>
      <img height={360} width="100%" src={DISCOVER_SERVERS_BACKGROUND} alt="explore servers" />
    </DiscoveryContainer>
  );
};

ServerDiscovery.propTypes = {

};

export default ServerDiscovery;
