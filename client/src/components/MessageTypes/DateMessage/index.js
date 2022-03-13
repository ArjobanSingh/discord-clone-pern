import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { DateContainer } from './styles';
import { formatDateWithMonth } from '../../../utils/helperFunctions';

const DateMessage = (props) => {
  const { date } = props;
  const formattedDate = formatDateWithMonth(date);
  return (
    <DateContainer>
      <Typography
        variant="caption"
        color="text.secondaryDark"
        lineHeight="1"
        backgroundColor="background.default"
      >
        {formattedDate}
      </Typography>
    </DateContainer>
  );
};

DateMessage.propTypes = {
  date: PropTypes.string.isRequired,
};

export default DateMessage;
