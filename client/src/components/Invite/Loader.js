// import PropTypes from 'prop-types';
import Skeleton from '@mui/material/Skeleton';
import { FlexDiv } from '../../common/StyledComponents';
import { skeletonButtonSx } from './styles';

const Loader = () => (
  <>
    <Skeleton
      variant="circular"
      width="80px"
      height="80px"
      animation="wave"
    />
    <Skeleton animation="wave" variant="text" height="2rem" width="200px" />
    <FlexDiv injectCss="width: 100%; gap: 5px; flex-direction: column; margin-bottom: 30px">
      <Skeleton animation="wave" variant="text" height="1rem" width="100%" />
      <Skeleton animation="wave" variant="text" height="1rem" width="200px" />
    </FlexDiv>
    <Skeleton
      variant="rectangular"
      width="100%"
      height="36px"
      sx={skeletonButtonSx}
      animation="wave"
    />
  </>
);

Loader.propTypes = {

};

export default Loader;
