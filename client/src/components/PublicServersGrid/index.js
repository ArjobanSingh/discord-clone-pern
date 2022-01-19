import React from 'react';
import PropTypes from 'prop-types';
// import { FixedSizeGrid } from 'react-window';
import { Grid, GridTile } from './styles';
import SingleServerTile from './SIngleServerTile';

const PublicServersGrid = (props) => {
  const { servers } = props;
  return (
    <Grid>
      {servers.map((server) => (
        <GridTile key={server.id}>
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
