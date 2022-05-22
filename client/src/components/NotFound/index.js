import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import StyledImage from '../../common/StyledImage';
import { NO_CHANNELS } from '../../constants/images';

const Container = styled.div(({ theme }) => `
  background-color: ${theme.palette.background.darker};
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${theme.spacing(4)};
  padding: ${theme.spacing(1)};
`);

const NotFound = (props) => (
  <Container>
    <StyledImage
      rel="No channels"
      src={NO_CHANNELS}
    />
    <Typography maxWidth="27rem" component="div" textAlign="center">
      <Typography margin="0 0 0.75rem" fontWeight="fontWeightBold" color="text.secondary">
        NO TEXT CHANNELS
      </Typography>
      <Typography variant="body2" color="text.secondaryDark">
        You find yourself in a strange place. You don&apos;t have access to any
        text channels, or there are none in this server
      </Typography>
    </Typography>
  </Container>
);

NotFound.propTypes = {

};

export default NotFound;
