// import PropTypes from 'prop-types';
import {
  memo, useState, useMemo,
} from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Header, SimpleEllipsis } from '../../common/StyledComponents';
import axiosInstance from '../../utils/axiosConfig';
import {
  AbsoluteUserName,
  ChannelItem,
  ChannelListContainer,
  ChannelTypeContainer,
  ExpandableIcon,
  InviteSection,
  InviteSectionWrapper,
  ListContainer,
  ListFooter,
  ScrollableListContainer,
  StyledAddIcon,
  StyledListButton,
  StyledListText,
  StyledMenu,
  UserAvatar,
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
import StyledTooltip from '../../common/StyledToolTip';
// import useDidUpdate from '../../customHooks/useDidUpdate';
import ConfirmationModal from '../../common/ConfirmationModal';
import { handleError } from '../../utils/helperFunctions';
import { ChannelApi } from '../../utils/apiEndpoints';
import { deleteChannelSuccess } from '../../redux/actions/channels';
import { AbsoluteProgress, ConfirmationButton } from '../ServerSettings/Options/styles';
import ChannelListLoader from './ChannelListLoader';
import Logo from '../../common/Logo';
import ThemeToggler from '../../common/ThemeToggler';
import { useUserSettings } from '../../providers/UserSettingsProvider';

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openUserSettingsDialog } = useUserSettings();

  const [modalState, setModalState] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [isTextChannelExpanded, setIsTextChannelExpanded] = useState(true);
  const [isAudioChannelExpanded, setIsAudioChannelExpanded] = useState(true);
  const [deleteChannelModalData, setDeleteChannelModalData] = useState(null);
  const [isDeletingChannel, setIsDeletingChannel] = useState(false);

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

  const closeSettingsMenu = () => {
    setMenuAnchorEl(null);
  };

  const closeModal = () => {
    setModalState(null);
    closeSettingsMenu();
    // on invite or channel modal close,
    // close settings menu as well
  };

  const openDeleteChannelModal = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const { id: channelId, name: channelName } = e.target.closest('button').dataset;
    setDeleteChannelModalData({ channelId, channelName });
  };

  const closeDeleteChannelModal = () => {
    setDeleteChannelModalData(null);
    setIsDeletingChannel(false);
  };

  const openChannelModal = (e) => {
    e.stopPropagation();
    setModalState(ModalTypes.CREATE_CHANNEL);
  };

  const deleteChannel = async () => {
    const { serverId } = params;
    const { channelId } = deleteChannelModalData;
    try {
      setIsDeletingChannel(true);
      const url = `${ChannelApi.DELETE_CHANNEL}/${serverId}/${channelId}`;
      const { data } = await axiosInstance.delete(url);

      // after success, directly navigate to server url
      // it will automatically open the first channel of current server
      if (params.channelId === data.channelId) {
        navigate(`/channels/${data.serverId}`, { replace: true });
      }
      dispatch(deleteChannelSuccess(data.serverId, data.channelId));
    } catch (err) {
      const sessionExpireError = handleError(err, (error) => {
        toast.error(`Error while deleting channel: ${error.message}`);
      });
      if (sessionExpireError) dispatch(sessionExpireError);
    } finally {
      closeDeleteChannelModal();
    }
  };

  if (!params.serverId || noServerFound) return <ChannelListLoader />;

  const hideOptions = !serverMember
    || (serverMember.role === ServerMemberRoles.USER && serverDetails.type === ServerTypes.PRIVATE);

  const canCreateChannel = serverMember
    ? ServerMemberScores[serverMember.role] >= ServerMemberScores[ServerMemberRoles.ADMIN]
    : false;

  const canDeleteChannel = canCreateChannel;

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
          ? (
            <CreateChannelModal
              serverId={serverDetails.id}
              closeModal={closeModal}
            />
          )
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
          <ScrollableListContainer>
            {Object.entries(channelListData).map(([key, data]) => (
              <ChannelTypeContainer key={key}>
                <StyledListButton onClick={channelsState[key].onChange}>
                  <ExpandableIcon isExpanded={channelsState[key].isExpanded} />
                  <StyledListText primary={data.title} />
                  {canCreateChannel && (
                  <StyledTooltip
                    placement="top"
                    title="Create Channel"
                  >
                    <StyledAddIcon onClick={openChannelModal} />
                  </StyledTooltip>
                  )}
                </StyledListButton>

                <Collapse in={channelsState[key].isExpanded} timeout="auto" unmountOnExit>
                  {data.channels.map((channel) => (
                    <Link to={`${params.serverId}/${channel.id}`} key={channel.id}>
                      <ChannelItem isChannelOpened={channel.id === params.channelId}>
                        <Tag />
                        <Typography
                          flex="1"
                          component="div"
                          maxWidth={canDeleteChannel ? 'calc(100% - 48px)' : 'calc(100% - 24px)'}
                        >
                          <SimpleEllipsis>
                            {channel.name}
                          </SimpleEllipsis>
                        </Typography>
                        {canDeleteChannel
                      && (
                      <StyledTooltip
                        placement="top"
                        title="Delete Channel"
                      >
                        <IconButton
                          onClick={openDeleteChannelModal}
                          data-id={channel.id}
                          data-name={channel.name}
                          size="small"
                        >
                          <DeleteIcon sx={{ fontSize: '1rem' }} />
                        </IconButton>
                      </StyledTooltip>
                      )}
                      </ChannelItem>
                    </Link>
                  ))}
                </Collapse>
              </ChannelTypeContainer>
            ))}
          </ScrollableListContainer>
        </ListContainer>

        <ListFooter>
          <UserAvatar src={user.profilePicture}>
            <Logo />
          </UserAvatar>
          <Typography
            variant="body2"
            component="div"
            flex="1"
            position="relative"
          >
            <AbsoluteUserName>
              <SimpleEllipsis>
                {user.name}
              </SimpleEllipsis>
            </AbsoluteUserName>
          </Typography>

          <ThemeToggler />
          <IconButton size="small" onClick={openUserSettingsDialog}>
            <SettingsIcon />
          </IconButton>
        </ListFooter>
      </ChannelListContainer>
      <TransitionModal
        open={!!modalState}
        onClose={closeModal}
      >
        <div>
          {getModalBody()}
        </div>
      </TransitionModal>

      {canDeleteChannel && (
        <ConfirmationModal
          open={!!deleteChannelModalData}
          onClose={closeDeleteChannelModal}
          title="Delete Channel"
          onConfirm={deleteChannel}
          confirmTitle={isDeletingChannel ? 'Deleting...' : 'Delete'}
          confirmButton={(
            <ConfirmationButton
              variant="contained"
              onClick={deleteChannel}
              isLoading={isDeletingChannel}
              color="error"
            >
              <span className="button-text">
                Delete channel
              </span>
              {isDeletingChannel && <AbsoluteProgress color="inherit" size={20} />}
            </ConfirmationButton>
          )}
          description={(
            <>
              Are you sure you want to delete
              {' '}
              <strong>{deleteChannelModalData?.channelName}</strong>
              {' '}
              channel?
            </>
          )}
        />
      )}

      <StyledMenu
        open={!!menuAnchorEl}
        anchorEl={menuAnchorEl}
        onClose={closeSettingsMenu}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
      >
        {!hideOptions && (
          <ServerSettingsMenu
            currentRole={serverMember.role}
            closeSettingsMenu={closeSettingsMenu}
            openCreateChannelModal={openChannelModal}
          />
        )}
      </StyledMenu>
    </>
  );
};

ChannelList.propTypes = {

};

export default memo(ChannelList);
