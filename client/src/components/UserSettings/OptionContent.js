import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { USER_SETTINGS } from '../../constants/user';
import { OptionContentContainer } from '../ServerSettings/styles';
import MyAccount from './Options/MyAccount';

// future settings main components can be added here
const data = {
  [USER_SETTINGS.MY_ACCOUNT]: {
    component: MyAccount,
    title: 'My Account',
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
