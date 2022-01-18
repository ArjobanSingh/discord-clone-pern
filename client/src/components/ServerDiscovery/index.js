import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FlexDiv } from '../../common/StyledComponents';
import { DISCOVER_SERVERS_BACKGROUND } from '../../constants/images';
import { exploreServersRequested } from '../../redux/actions/servers';
import { getExploreServers } from '../../redux/reducers';
import PublicServersGrid from '../PublicServersGrid';
import { DiscoveryContainer, Wrapper } from './styles';

const ServerDiscovery = (props) => {
  const { data, error } = useSelector(getExploreServers);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(exploreServersRequested());
  }, []);

  const getMainJSX = () => {
    if (error) return <div>TODO: error getting all servers, Retry</div>;
    if (!data) return <div>TODO: data loading</div>;
    return <PublicServersGrid servers={data} />;
  };

  return (
    <Wrapper>
      <DiscoveryContainer>
        <img height={360} width="100%" src={DISCOVER_SERVERS_BACKGROUND} alt="explore servers" />
        {getMainJSX()}
      </DiscoveryContainer>
    </Wrapper>
  );
};

ServerDiscovery.propTypes = {

};

export default ServerDiscovery;
