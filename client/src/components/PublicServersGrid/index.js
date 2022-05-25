import { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
// import { FixedSizeGrid } from 'react-window';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Grid, GridTile } from './styles';
import SingleServerTile from './SIngleServerTile';
import { addExploreServerData, exploreMoreServersRequested } from '../../redux/actions/servers';
import { getAllServers, getExploreServersList } from '../../redux/reducers';

const PublicServersGrid = (props) => {
  const { servers } = props;
  const userJoinedServers = useSelector(getAllServers);
  const { isLoadingMore, hasMore } = useSelector(getExploreServersList);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const parentDiv = useRef(document.getElementById('server-discovery-container'));

  const intersectionObserver = useRef();

  useEffect(() => () => {
    if (intersectionObserver.current) {
      intersectionObserver.current.disconnect?.();
    }
  }, []);

  const lastGridRefCallback = useCallback((node) => {
    // whenever last node will change, this func will run
    // and this will disconnect previous observer and it's node
    if (intersectionObserver.current) intersectionObserver.current.disconnect();
    if (!hasMore) return;

    intersectionObserver.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (isLoadingMore) return;
        dispatch(exploreMoreServersRequested());
      }
    });

    if (node) intersectionObserver.current.observe(node);
  }, [isLoadingMore, hasMore]);

  const viewPublicServer = (e) => {
    const { index } = e.target.closest('.grid-tile').dataset;
    const requestedServer = servers[index];
    if (!(userJoinedServers[requestedServer.id])) {
      dispatch(addExploreServerData(requestedServer));
    }
    navigate(`/channels/${requestedServer.id}`);
  };

  return (
    <Grid>
      {servers.map((server, index) => (
        <GridTile
          onClick={viewPublicServer}
          key={server.id}
          data-index={index}
          className="grid-tile"
          ref={index === servers.length - 1 ? lastGridRefCallback : null}
        >
          <SingleServerTile server={server} />
        </GridTile>
      ))}
    </Grid>
  );
};

PublicServersGrid.propTypes = {
  servers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default PublicServersGrid;
