import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridTile } from './styles';

const PublicServersGrid = (props) => {
  const { servers } = props;
  return (
    <Grid>
      {servers.map((server) => (
        <GridTile key={server.id}>{server.name}</GridTile>
      ))}
    </Grid>
  );
};

PublicServersGrid.propTypes = {
  servers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default PublicServersGrid;
