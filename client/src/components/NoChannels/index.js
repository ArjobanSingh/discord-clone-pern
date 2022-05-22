import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import NotFound from '../NotFound';

const NoChannels = ({ setOpenedChannel }) => {
  useEffect(() => {
    setOpenedChannel({});
  }, []);

  return (
    <NotFound />
  );
};

NoChannels.propTypes = {
  setOpenedChannel: PropTypes.func.isRequired,
};

export default NoChannels;
