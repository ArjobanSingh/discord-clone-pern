import React from 'react';
import PropTypes from 'prop-types';
// import { FixedSizeGrid } from 'react-window';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Grid, GridTile } from './styles';
import SingleServerTile from './SIngleServerTile';
import { exploreServerDataRequested } from '../../redux/actions/servers';

const PublicServersGrid = (props) => {
  const { servers } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const viewPublicServer = (e) => {
    const { index } = e.target.closest('.grid-tile').dataset;
    const requestedServer = servers[index];
    dispatch(exploreServerDataRequested(requestedServer));
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
