import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
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

  const navigate = useNavigate();
  const { user } = useUser();

  const [serverDetails] = useApi(fetchServerDetails, {
    isConditionMet: !!user,
    callbackParams: { inviteId },
  });

  const { isLoading, data: server, error } = serverDetails;

  const navigateToChannels = () => {
    navigate('/');
  };

  const getMainJSX = () => {
    if (error) {
      return (
        <>
          Invalid Link
          <Button fullWidth onClick={navigateToChannels} variant="contained">
            Continue to discord
          </Button>
        </>
      );
    }
    if (isLoading || !server) return <div>Loading details...</div>;
    return <MainContent server={server} inviteId={inviteId} />;
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
