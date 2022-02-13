import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const NoChannels = ({ setOpenedChannel }) => {
  useEffect(() => {
    setOpenedChannel({});
  }, []);

  return (
    <div>TODO: no channels Ui....</div>
  );
};

NoChannels.propTypes = {
  setOpenedChannel: PropTypes.func.isRequired,
};

export default NoChannels;
