import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { Wrapper } from './styles';
import { InviteApi } from '../../utils/apiEndpoints';
import useUser from '../../customHooks/userUser';
import useApi from '../../customHooks/useApi';
import MainContent from './MainContent';
import { INVITE_LINK_EXPIRED } from '../../constants/images';
import { FlexDiv } from '../../common/StyledComponents';
import Loader from './Loader';

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
          <img
            src={INVITE_LINK_EXPIRED}
            alt="link expired"
            height="80px"
          />
          <FlexDiv injectCss="flex-direction: column; gap: 5px; margin-bottom: 30px">
            <Typography
              variant="h5"
              fontWeight="fontWeightBold"
              color="text.primary"
            >
              Invalid Link
            </Typography>
            <Typography
              color="text.secondaryDark"
              textAlign="center"
              lineHeight="normal"
            >
              This invite may be expired, or you might not have permission to join.
            </Typography>
          </FlexDiv>
          <Button fullWidth onClick={navigateToChannels} variant="contained">
            Continue to discord
          </Button>
        </>
      );
    }
    if (isLoading || !server) return <Loader />;
    return <MainContent server={server} inviteId={inviteId} />;
  };

  return (
    <Wrapper gap="5px">
      {getMainJSX()}
    </Wrapper>
  );
};

Invite.propTypes = {
  inviteId: PropTypes.string.isRequired,
};

export default Invite;
