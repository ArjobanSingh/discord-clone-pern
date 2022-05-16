// import PropTypes from 'prop-types';
import {
  memo, useState, useMemo,
} from 'react';
import { Link, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Button from '@mui/material/Button';
import { Header } from '../../common/StyledComponents';
import {
  ChannelItem,
  ChannelListContainer,
  ChannelTypeContainer,
  ExpandableIcon,
  InviteSection,
  InviteSectionWrapper,
  ListContainer,
  StyledAddIcon,
  StyledListButton,
  StyledListText,
  StyledMenu,
} from './styles';
import TransitionModal from '../../common/TransitionModal';
import InviteModal from '../InviteModal';
import useUser from '../../customHooks/useUser';
import { ServerMemberRoles, ServerMemberScores, ServerTypes } from '../../constants/servers';
import useServerData from '../../customHooks/useServerData';
import ServerSettingsMenu from '../ServerSettingsMenu';
import Tag from '../../common/Tag';
import { ChannelType } from '../../constants/channels';
import CreateChannelModal from '../CreateChannelModal';

const anchorOrigin = {
  vertical: 'bottom',
  horizontal: 'right',
};

const transformOrigin = {
  vertical: 'top',
  horizontal: 'right',
};

const ModalTypes = {
  INVITE: 'INVITE',
  CREATE_CHANNEL: 'CREATE_CHANNEL',
};

const ChannelList = (props) => {
  const params = useParams();
  const { serverDetails, noServerFound } = useServerData(params.serverId);
  const { user } = useUser();

  const [modalState, setModalState] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [isTextChannelExpanded, setIsTextChannelExpanded] = useState(true);
  const [isAudioChannelExpanded, setIsAudioChannelExpanded] = useState(true);

  const serverMember = useMemo(() => (
    serverDetails?.members?.find((member) => member.userId === user.id)
  ), [serverDetails?.members, user.id]);

  const channelListData = useMemo(() => {
    const textChannels = [];
    const audioChannels = [];
    serverDetails?.channels?.forEach((channel) => {
      if (channel.type === ChannelType.TEXT) {
        textChannels.push(channel);
        return;
      }
      audioChannels.push(channel);
    });
    return {
      text: {
        title: 'Text Channels',
        channels: textChannels,
      },
      audio: {
        title: 'Audio Channels',
        channels: audioChannels,
      },
    };
  }, [serverDetails?.channels]);

  const channelsState = {
    text: {
      isExpanded: isTextChannelExpanded,
      onChange: () => setIsTextChannelExpanded((prev) => !prev),
    },
    audio: {
      isExpanded: isAudioChannelExpanded,
      onChange: () => setIsAudioChannelExpanded((prev) => !prev),
    },
  };

  const openInviteModal = () => {
    setModalState(ModalTypes.INVITE);
  };

  const closeModal = () => {
    setModalState(null);
  };

  const closeSettingsMenu = () => {
    setMenuAnchorEl(null);
  };

  if (!params.serverId) {
    return <div>Me server list</div>;
  }

  if (noServerFound) {
    return <div>No such server found</div>;
  }

  const openChannelModal = (e) => {
    e.stopPropagation();
    setModalState(ModalTypes.CREATE_CHANNEL);
  };

  // TODO: correct loading when fetching server members
  const hideOptions = !serverMember
    || (serverMember.role === ServerMemberRoles.USER && serverDetails.type === ServerTypes.PRIVATE);

  const canCreateChannel = serverMember
    ? ServerMemberScores[serverMember.role] >= ServerMemberScores[ServerMemberRoles.ADMIN]
    : false;

  const getModalBody = () => {
    switch (modalState) {
      case ModalTypes.INVITE:
        return hideOptions
          ? null
          : (
            <InviteModal
              serverId={serverDetails.id}
              closeModal={closeModal}
              inviteUrls={serverDetails.inviteUrls}
            />
          );
      case ModalTypes.CREATE_CHANNEL:
        return canCreateChannel
          ? (<CreateChannelModal />)
          : null;
      default:
        return null;
    }
  };
  return (
    <>
      <ChannelListContainer>
        <Header>
          <Box
            display="flex"
            width="100%"
            justify-content="space-between"
            alignItems="center"
            color="text.primary"
          >
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
            {!hideOptions && (
              <IconButton
                color="inherit"
                aria-label="open server settings"
                size="small"
                sx={{ marginRight: '-10px' }}
                onClick={(e) => {
                  setMenuAnchorEl(e.currentTarget);
                }}
              >
                <KeyboardArrowDownIcon />
              </IconButton>
            )}
          </Box>
        </Header>

        {!hideOptions && (
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
        <ListContainer isInviteBoxVisible={!hideOptions}>
          {Object.entries(channelListData).map(([key, data]) => (
            <ChannelTypeContainer key={key}>
              <StyledListButton onClick={channelsState[key].onChange}>
                <ExpandableIcon isExpanded={channelsState[key].isExpanded} />
                <StyledListText primary={data.title} />
                {canCreateChannel && <StyledAddIcon onClick={openChannelModal} />}
              </StyledListButton>

              <Collapse in={channelsState[key].isExpanded} timeout="auto" unmountOnExit>
                {data.channels.map((channel) => (
                  <Link to={`${params.serverId}/${channel.id}`} key={channel.id}>
                    <ChannelItem isChannelOpened={channel.id === params.channelId}>
                      <Tag />
                      <Typography>
                        {channel.name}
                      </Typography>
                    </ChannelItem>
                  </Link>
                ))}
              </Collapse>
            </ChannelTypeContainer>
          ))}

        </ListContainer>

      </ChannelListContainer>
      {!hideOptions && (
        <TransitionModal
          open={!!modalState}
          onClose={closeModal}
          // aria-labelledby="invite-modal-title"
        >
          <div>
            {getModalBody()}
          </div>
        </TransitionModal>
      )}

      <StyledMenu
        open={!!menuAnchorEl}
        anchorEl={menuAnchorEl}
        onClose={closeSettingsMenu}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
      >
        {!hideOptions && (
          <ServerSettingsMenu currentRole={serverMember.role} />
        )}
      </StyledMenu>
    </>
  );
};

ChannelList.propTypes = {

};

export default memo(ChannelList);
