// import PropTypes from 'prop-types';
import Skeleton from '@mui/material/Skeleton';
import {
  ContentWrapper, Grid, GridTile, ImageWrapper, ItemWrapper,
} from './styles';

const dummyArray = [...Array(8).keys()];

const PublicServersLoader = () => (
  <Grid>
    {dummyArray.map((it) => (
      <GridTile key={it}>
        <ItemWrapper>
          <ImageWrapper>
            <Skeleton variant="rectangle" width="100%" height="100%" animation="wave" />
          </ImageWrapper>
          <ContentWrapper>
            <Skeleton variant="text" width="40%" height="1.25rem" animation="wave" />
            <Skeleton
              variant="rectangular"
              width="100%"
              height="3.5rem"
              animation="wave"
              sx={{ borderRadius: '4px' }}
            />
            <Skeleton
              variant="text"
              width="70%"
              height="1rem"
              animation="wave"
              sx={{ marginTop: 'auto' }}
            />
          </ContentWrapper>
        </ItemWrapper>
      </GridTile>
    ))}
  </Grid>
);

PublicServersLoader.propTypes = {

};

export default PublicServersLoader;
