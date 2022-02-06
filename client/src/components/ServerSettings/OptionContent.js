import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { SERVER_SETTINGS } from '../../constants/servers';
import { OptionContentContainer } from './styles';
import ServerOverview from './Options/ServerOverview';

const { OVERVIEW, MEMBERS, BANS } = SERVER_SETTINGS;

const data = {
  [OVERVIEW]: {
    component: ServerOverview,
    title: 'Server Overview',
  },
  [MEMBERS]: {
    component: () => <div>MEMBERS</div>,
    title: 'Server Members',
  },
  [BANS]: {
    component: () => <div>BANS</div>,
    title: 'Server Bans',
  },
};

const OptionContent = (props) => {
  const { openedTab } = props;

  const {
    component: Component,
    title,
  } = data[openedTab];

  return (
    <OptionContentContainer>
      <Typography
        variant="h6"
        color="text.primary"
        fontWeight="fontWeightBold"
      >
        {title}
      </Typography>
      <Component />
    </OptionContentContainer>
  );
};

OptionContent.propTypes = {
  openedTab: PropTypes.string.isRequired,
};

export default OptionContent;
