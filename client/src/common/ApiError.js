import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ErrorSvg from './ErrorSvg';

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const AbsoluteDiv = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden auto;
  padding: 1rem;
`;

const Centerd = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  gap: 1rem;
`;

const ApiError = ({ error, errorDescription, retry }) => (
  <Container>
    <AbsoluteDiv>
      <Centerd>
        <ErrorSvg width="max(50%, 300px)" height="300px" />
        <Typography component="div" textAlign="center">
          <Typography
            variant="h6"
            color="error.main"
          >
            {error}
          </Typography>
          <Typography variant="body2" color="text.primary">
            {errorDescription}
          </Typography>
        </Typography>
        <Button variant="contained" onClick={retry}>
          Click to retry
        </Button>
      </Centerd>
    </AbsoluteDiv>
  </Container>
);

ApiError.propTypes = {
  error: PropTypes.string,
  retry: PropTypes.func.isRequired,
  errorDescription: PropTypes.string.isRequired,
};

ApiError.defaultProps = {
  error: 'Something went wrong',
};

export default ApiError;
