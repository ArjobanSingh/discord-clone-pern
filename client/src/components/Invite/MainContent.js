import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { FlexDiv } from '../../common/StyledComponents';
import { serverLogoSx } from './styles';
import { getCharacterName } from '../../utils/helperFunctions';
import { getJoinServerApi, getServerDetails } from '../../redux/reducers';
import { joinServerRequested } from '../../redux/actions/servers';
import DotLoader from '../../common/DotLoader';

const MainContent = (props) => {
  const { server } = props;

  const savedServer = useSelector((state) => getServerDetails(state, server.id));
  const joinServerApi = useSelector((state) => getJoinServerApi(state, server.id)) || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const acceptInvite = () => {
    if (savedServer) {
      // user already present in server, navigate directly
      navigate(`/channels/${savedServer.id}`, { replace: true });
      return;
    }

    dispatch(joinServerRequested(server.id));
  };

  const { isLoading: isJoiningServer, error } = joinServerApi;

  return (
    <>
      <Typography
        variant="subtitle2"
        color="text.secondaryDark"
      >
        You have been invited to join
      </Typography>
      <FlexDiv injectCss="flex-direction: row; margin-bottom: 30px">
        <Avatar sx={serverLogoSx}>
          {getCharacterName(server.name)}
        </Avatar>
        <Typography
          variant="h5"
          fontWeight="fontWeightBold"
          color="text.primary"
        >
          {`${server.name[0].toUpperCase()}${server.name.slice(1)}`}
        </Typography>
      </FlexDiv>
      <Button variant="contained" fullWidth onClick={acceptInvite}>
        <Typography variant="body2" visibility={isJoiningServer ? 'hidden' : ''}>Accept Invite</Typography>
        {isJoiningServer && <DotLoader />}
      </Button>
    </>
  );
};

MainContent.propTypes = {
  server: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default MainContent;
