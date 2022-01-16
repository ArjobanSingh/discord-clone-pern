// import PropTypes from 'prop-types';
import { memo, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Header } from '../../common/StyledComponents';
import { ChannelListContainer, InviteSection, InviteSectionWrapper } from './styles';
import TransitionModal from '../../common/TransitionModal';
import InviteModal from '../InviteModal';
import { getServerDetails } from '../../redux/reducers';
import useUser from '../../customHooks/useUser';
import { Roles } from '../../constants/serverMembers';
import { ServerTypes } from '../../constants/servers';

const ChannelList = (props) => {
  const params = useParams();
  const currentServer = useSelector((state) => getServerDetails(state, params.serverId));
  const { user } = useUser();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const serverMember = useMemo(() => (
    currentServer?.members?.find((member) => member.userId === user.id)
  ), [currentServer?.members]);

  const toggleInviteModal = () => {
    setIsInviteModalOpen((prev) => !prev);
  };

  if (!params.serverId) {
    return <div>Me server list</div>;
  }

  if (!currentServer) {
    return <div>No such server found</div>;
  }

  // TODO: correct loading when fetching server members
  const hideInvite = !serverMember
    || (serverMember.role === Roles.USER && currentServer.type === ServerTypes.PRIVATE);

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
        {!hideInvite && (
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
        )}
      </ChannelListContainer>
      {!hideInvite && (
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
      )}
    </>
  );
};

ChannelList.propTypes = {

};

export default memo(ChannelList);
