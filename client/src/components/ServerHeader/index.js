import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import Box from '@mui/material/Box';
import { Header } from '../../common/StyledComponents';
import Tag from '../../common/Tag';

const ServerHeader = (props) => {
  const { serverName, openServerListDrawer, openMembersDrawer } = props;
  return (
    <Header>
      <Box
        fontSize="h5.fontSize"
        height="100%"
        width="100%"
        alignItems="center"
        justifyContent="space-between"
        display="flex"
        color="text.secondaryDark"
        gap="10px"
      >
        <Box display="flex" gap="10px" alignItems="center">
          <IconButton
            color="inherit"
            aria-label="open server list drawer"
            onClick={openServerListDrawer}
            sx={{ display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Tag />
          <Typography
            color="text.primary"
            lineHeight="normal"
            fontWeight="fontWeightBold"
          >
            {serverName}
          </Typography>
        </Box>
        <Box display="flex" gap="10px" alignItems="center">
          <IconButton
            color="inherit"
            aria-label="open server members"
            onClick={openMembersDrawer}
          >
            <PeopleAltIcon />
          </IconButton>
        </Box>
      </Box>
    </Header>
  );
};

ServerHeader.propTypes = {
  serverName: PropTypes.string.isRequired,
  openServerListDrawer: PropTypes.func.isRequired,
  openMembersDrawer: PropTypes.func.isRequired,
};

export default ServerHeader;
