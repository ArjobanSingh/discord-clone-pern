import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
// import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Logo from '../../common/Logo';
import { logoSx, Wrapper } from './styles';
import { InviteApi } from '../../utils/apiEndpoints';
import useUser from '../../customHooks/userUser';
import useApi from '../../customHooks/useApi';
import MainContent from './MainContent';

const fetchServerDetails = async (axiosInstance, { inviteId }) => {
  const url = `${InviteApi.VERIFY_INVITE_URL}/${inviteId}`;
  const response = await axiosInstance.get(url);
  return response.data;
};

const Invite = (props) => {
  const { inviteId } = props;

  const { user } = useUser();

  const [serverDetails, retry] = useApi(fetchServerDetails, {
    isConditionMet: !!user,
    callbackParams: { inviteId },
  });

  const { isLoading, data: server, error } = serverDetails;

  const getMainJSX = () => {
    if (error) {
      return (
        <div>
          {error.message}
          <Button onClick={retry} variant="contained" fullWidth>
            Retry
          </Button>
        </div>
      );
    }
    if (isLoading || !server) return <div>Loading details...</div>;
    return <MainContent server={server} />;
  };

  return (
    <Wrapper gap="5px">
      <Avatar sx={logoSx}>
        <Logo />
      </Avatar>
      {getMainJSX()}
    </Wrapper>
  );
};

Invite.propTypes = {
  inviteId: PropTypes.string.isRequired,
};

export default Invite;
