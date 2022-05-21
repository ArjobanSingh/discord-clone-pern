import { useEffect } from 'react';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { DISCOVER_SERVERS_BACKGROUND } from '../../constants/images';
import { exploreServersRequested } from '../../redux/actions/servers';
import { getExploreServersList } from '../../redux/reducers';
import PublicServersGrid from '../PublicServersGrid';
import ServerHeader from '../ServerHeader';
import {
  AbsoluteWrapperChild, DiscoveryContainer, ImageWrapper, Wrapper,
} from './styles';
import { isEmpty } from '../../utils/validators';

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
    if (isEmpty(data)) return <div>TODO: empty public servers</div>;
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
          <ImageWrapper>
            <AbsoluteWrapperChild>
              <Typography
                fontWeight="fontWeightBold"
                variant="h6"
                color="text.primary"
              >
                Find your community on Discord-Clone
              </Typography>
              <Typography variant="body2" color="text.primary">
                From gaming, to music, to learning, there&apos;s a place for you.
              </Typography>
            </AbsoluteWrapperChild>
            <img height="100%" width="100%" src={DISCOVER_SERVERS_BACKGROUND} alt="explore servers" />
          </ImageWrapper>
          {getMainJSX()}
        </DiscoveryContainer>
      </Wrapper>
    </>
  );
};

ServerDiscovery.propTypes = {

};

export default ServerDiscovery;
