// import PropTypes from 'prop-types';
import {
  memo, useState, useMemo,
} from 'react';
import { Link, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
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
  StyledMenu,
} from './styles';
import TransitionModal from '../../common/TransitionModal';
import InviteModal from '../InviteModal';
import useUser from '../../customHooks/useUser';
import { Roles } from '../../constants/serverMembers';
import { ServerTypes } from '../../constants/servers';
import useServerData from '../../customHooks/useServerData';
import ServerSettingsMenu from '../ServerSettingsMenu';
import Tag from '../../common/Tag';
import { ChannelType } from '../../constants/channels';

const anchorOrigin = {
  vertical: 'bottom',
  horizontal: 'right',
};

const transformOrigin = {
  vertical: 'top',
  horizontal: 'right',
};

const ChannelList = (props) => {
  const params = useParams();
  const { serverDetails, noServerFound } = useServerData(params.serverId);
  const { user } = useUser();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
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
    setIsInviteModalOpen(true);
  };

  const closeInviteModal = () => {
    setIsInviteModalOpen(false);
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

  // TODO: correct loading when fetching server members
  const hideOptions = !serverMember
    || (serverMember.role === Roles.USER && serverDetails.type === ServerTypes.PRIVATE);

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
              <ListItemButton onClick={channelsState[key].onChange}>
                <ExpandableIcon isExpanded={channelsState[key].isExpanded} />
                <ListItemText primary={data.title} />
              </ListItemButton>

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
