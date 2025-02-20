import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { FlexDiv } from '../../common/StyledComponents';
import { logoSx, serverLogoSx } from './styles';
import { getJoinServerApi, getServerDetails } from '../../redux/reducers';
import { joinServerRequested } from '../../redux/actions/servers';
import DotLoader from '../../common/DotLoader';
import Error from '../../common/Error';
import Logo from '../../common/Logo';

const MainContent = (props) => {
  const { server, inviteId } = props;

  const savedServer = useSelector((state) =>
    getServerDetails(state, server.id)
  );
  const joinServerApi =
    useSelector((state) => getJoinServerApi(state, inviteId)) || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const acceptInvite = () => {
    if (savedServer) {
      // user already present in server, navigate directly
      navigate(`/channels/${savedServer.id}`, { replace: true });
      return;
    }

    dispatch(joinServerRequested(server, inviteId));
  };

  const { isLoading: isJoiningServer, error } = joinServerApi;

  return (
    <>
      <Avatar sx={logoSx}>
        <Logo />
      </Avatar>
      <Typography variant="subtitle2" color="text.secondaryDark">
        You have been invited to join
      </Typography>
      <FlexDiv injectCss="flex-direction: row; margin-bottom: 30px">
        <Avatar sx={serverLogoSx}>{server.name}</Avatar>
        <Typography
          variant="h5"
          fontWeight="fontWeightBold"
          color="text.primary"
        >
          {`${server.name[0].toUpperCase()}${server.name.slice(1)}`}
        </Typography>
      </FlexDiv>
      <Button variant="contained" fullWidth onClick={acceptInvite}>
        <Typography
          variant="body2"
          visibility={isJoiningServer ? 'hidden' : ''}
        >
          Accept Invite
        </Typography>
        {isJoiningServer && <DotLoader />}
      </Button>
      {!!error && (
        <Error>
          {error.message || 'Something went wrong in joining server'}
        </Error>
      )}
    </>
  );
};

MainContent.propTypes = {
  server: PropTypes.shape({
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  inviteId: PropTypes.string.isRequired,
};

export default MainContent;
