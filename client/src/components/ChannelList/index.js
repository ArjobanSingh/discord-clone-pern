// import PropTypes from 'prop-types';
import { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Header } from '../../common/StyledComponents';
import { ChannelListContainer, InviteSection, InviteSectionWrapper } from './styles';
import TransitionModal from '../../common/TransitionModal';
import InviteModal from '../InviteModal';
import { getServerDetails } from '../../redux/reducers';

const ChannelList = (props) => {
  const params = useParams();
  const currentServer = useSelector((state) => getServerDetails(state, params.serverId));
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const toggleInviteModal = () => {
    setIsInviteModalOpen((prev) => !prev);
  };

  if (!params.serverId) {
    return <div>Me server list</div>;
  }

  if (!currentServer) {
    return <div>No such server found</div>;
  }

  return (
    <>
      <ChannelListContainer>
        <Header>
          <Typography
            variant="h1"
            color="text.primary"
            fontSize="subtitle1.fontSize"
            fontWeight="fontWeightBold"
            flex={1}
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            overflow="hidden"
            sx={{ wordBreak: 'break-all' }}
          >
            {`${currentServer.name[0].toUpperCase()}${currentServer.name.slice(1)}`}
          </Typography>
        </Header>
        <InviteSectionWrapper>
          <InviteSection>
            {['An adventure begins.', 'Let\'s add some friends!'].map((text) => (
              <Typography
                key={text}
                variant="body2"
                component="div"
                fontWeight="fontWeightLight"
              >
                {text}

              </Typography>
            ))}
            <Button
              type="submit"
              color="primary"
              variant="contained"
              onClick={toggleInviteModal}
            >
              <div>Invite People</div>
            </Button>
          </InviteSection>
        </InviteSectionWrapper>
      </ChannelListContainer>
      <TransitionModal
        open={isInviteModalOpen}
        onClose={toggleInviteModal}
        aria-labelledby="invite-modal-title"
      >
        <div>
          <InviteModal
            serverId={currentServer.id}
            closeModal={toggleInviteModal}
            inviteUrls={currentServer.inviteUrls}
          />
        </div>
      </TransitionModal>
    </>
  );
};

ChannelList.propTypes = {

};

export default memo(ChannelList);
