import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { Header } from '../../common/StyledComponents';
import Tag from '../../common/Tag';

const ServerHeader = (props) => {
  const {} = props;
  return (
    <Header>
      <Box
        fontSize="h5.fontSize"
        height="100%"
        width="100%"
        alignItems="center"
        display="flex"
        color="text.secondaryDark"
        gap="10px"
      >
        <Tag />
      </Box>
    </Header>
  );
};

ServerHeader.propTypes = {

};

export default ServerHeader;
