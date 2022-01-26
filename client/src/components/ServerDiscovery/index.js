import { useEffect } from 'react';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import { DISCOVER_SERVERS_BACKGROUND } from '../../constants/images';
import { exploreServersRequested } from '../../redux/actions/servers';
import { getExploreServersList } from '../../redux/reducers';
import PublicServersGrid from '../PublicServersGrid';
import ServerHeader from '../ServerHeader';
import { DiscoveryContainer, Wrapper } from './styles';

const ServerDiscovery = (props) => {
  const { data, error } = useSelector(getExploreServersList);
  const dispatch = useDispatch();
  const matches = useMediaQuery((theme) => theme.breakpoints.up('sm'));
  const openServerListDrawer = useOutletContext();

  const isExtraSmallScreen = !matches;
  useEffect(() => {
    dispatch(exploreServersRequested());
  }, []);

  const getMainJSX = () => {
    if (error) return <div>TODO: error getting all servers, Retry</div>;
    if (!data) return <div>TODO: data loading</div>;
    return <PublicServersGrid servers={data} />;
  };

  return (
    <>
      {isExtraSmallScreen && (
        <ServerHeader
          openServerListDrawer={openServerListDrawer}
        />
      )}
      <Wrapper>
        <DiscoveryContainer>
          <img height={360} width="100%" src={DISCOVER_SERVERS_BACKGROUND} alt="explore servers" />
          {getMainJSX()}
        </DiscoveryContainer>
      </Wrapper>
    </>
  );
};

ServerDiscovery.propTypes = {

};

export default ServerDiscovery;
