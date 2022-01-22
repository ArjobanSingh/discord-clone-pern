// import PropTypes from 'prop-types';
import { memo, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Header } from '../../common/StyledComponents';
import { ChannelListContainer, InviteSection, InviteSectionWrapper } from './styles';
import TransitionModal from '../../common/TransitionModal';
import InviteModal from '../InviteModal';
import useUser from '../../customHooks/useUser';
import { Roles } from '../../constants/serverMembers';
import { ServerTypes } from '../../constants/servers';
import useServerData from '../../customHooks/useServerData';

const ChannelList = (props) => {
  const params = useParams();
  const { serverDetails, noServerFound } = useServerData(params.serverId);
  const { user } = useUser();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const serverMember = useMemo(() => (
    serverDetails?.members?.find((member) => member.userId === user.id)
  ), [serverDetails?.members]);

  const openInviteModal = () => {
    setIsInviteModalOpen(true);
  };

  const closeInviteModal = () => {
    setIsInviteModalOpen(false);
  };

  if (!params.serverId) {
    return <div>Me server list</div>;
  }

  if (noServerFound) {
    return <div>No such server found</div>;
  }

  // TODO: correct loading when fetching server members
  const hideInvite = !serverMember
    || (serverMember.role === Roles.USER && serverDetails.type === ServerTypes.PRIVATE);

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
            {serverDetails.name
              ? `${serverDetails.name[0].toUpperCase()}${serverDetails.name.slice(1)}`
              : null}
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
                onClick={openInviteModal}
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
          onClose={closeInviteModal}
          aria-labelledby="invite-modal-title"
        >
          <div>
            <InviteModal
              serverId={serverDetails.id}
              closeModal={closeInviteModal}
              inviteUrls={serverDetails.inviteUrls}
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
