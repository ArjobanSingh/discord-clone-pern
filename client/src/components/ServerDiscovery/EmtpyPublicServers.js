import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(5)};

  & > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${({ theme }) => theme.spacing(2)};
    width: fit-content;
    text-align: center;
  }
`;

const EmtpyPublicServers = (props) => {
  const { openCreateModal } = props;
  return (
    <Container>
      <div>
        <Typography component="div" textAlign="center">
          <Typography variant="h4" color="text.primary" fontWeight="fontWeightBold">
            Oops! No Public server available
          </Typography>
        </Typography>
        <Button variant="contained" fullWidth onClick={openCreateModal}>
          Create a new Server
        </Button>
      </div>
    </Container>
  );
};

EmtpyPublicServers.propTypes = {
  openCreateModal: PropTypes.func.isRequired,
};

export default EmtpyPublicServers;
