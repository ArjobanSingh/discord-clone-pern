import React from 'react';
import PropTypes from 'prop-types';
// import { FixedSizeGrid } from 'react-window';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Grid, GridTile } from './styles';
import SingleServerTile from './SIngleServerTile';
import { addExploreServerData } from '../../redux/actions/servers';
import { getAllServers } from '../../redux/reducers';

const PublicServersGrid = (props) => {
  const { servers } = props;
  const userJoinedServers = useSelector(getAllServers);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
