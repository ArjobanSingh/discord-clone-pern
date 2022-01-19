import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import {
  ContentWrapper, Dot, GridImage, ImageWrapper, ItemWrapper,
} from './styles';
import { DEFAULT_SERVER_ICON } from '../../constants/images';
import { EllipsisDiv, FlexDiv } from '../../common/StyledComponents';

const SingleServerTile = (props) => {
  const { server } = props;
  return (
    <ItemWrapper>
      <ImageWrapper>
        <GridImage src={server.avatar || DEFAULT_SERVER_ICON} alt="server icon" />
      </ImageWrapper>
      <ContentWrapper>
        <Typography
          variant="subtitle1"
          fontWeight="fontWeightBold"
          color="text.primary"
        >
          {server.name}
        </Typography>
        <EllipsisDiv linesCount={3}>
          <Typography
            variant="subtitle2"
            fontWeight="fontWeightRegular"
            color="text.secondary"
          >
            Welcome to Discord Town Hall—the official place for general
            conversation as well as hanging out with the community.
          </Typography>
        </EllipsisDiv>
        <FlexDiv injectCss="margin-top: auto; justify-content: revert;">
          <Dot />
          <Typography
            variant="caption"
            color="text.secondary"
            lineHeight="normal"
          >
            {server.memberCount}
            {' '}
            {server.memberCount > 1 ? 'Members' : 'Member'}
          </Typography>
        </FlexDiv>
      </ContentWrapper>
    </ItemWrapper>
  );
};

SingleServerTile.propTypes = {
  server: PropTypes.shape({
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    memberCount: PropTypes.number.isRequired,
  }).isRequired,
};

export default SingleServerTile;
