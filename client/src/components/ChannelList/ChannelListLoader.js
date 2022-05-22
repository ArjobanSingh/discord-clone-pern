import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Skeleton from '@mui/material/Skeleton';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 10px;
`;

const ListWrapper = styled.div`
  padding-inline: 10px;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 5px;

  .skeleton-content {
    width: calc(100% - 30px);
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

// random number between 50 AND 100
const getRandomWidth = () => Math.floor(Math.random() * 51) + 50;

const ChannelListLoader = (props) => (
  <Container>
    <div>
      <Skeleton animation="wave" variant="text" height="2rem" width="80px" />
      <ListWrapper>
        {[1, 2, 3, 4, 5, 6].map((it) => (
          <Row key={it}>
            <Skeleton width="20px" height="20px" animation="wave" variant="circular" />
            <div className="skeleton-content">
              <Skeleton width={`${getRandomWidth()}%`} height="30px" animation="wave" variant="text" />
            </div>
          </Row>
        ))}
      </ListWrapper>
    </div>
    <div>
      <Skeleton animation="wave" variant="text" height="2rem" width="80px" />
      <ListWrapper>
        {[1, 2, 3, 4, 5, 6].map((it) => (
          <Row key={it}>
            <Skeleton width="20px" height="20px" animation="wave" variant="circular" />
            <div className="skeleton-content">
              <Skeleton width={`${getRandomWidth()}%`} height="30px" animation="wave" variant="text" />
            </div>
          </Row>
        ))}
      </ListWrapper>
    </div>
  </Container>
);

ChannelListLoader.propTypes = {

};

export default ChannelListLoader;
