// import PropTypes from 'prop-types';
import {
  memo, useMemo, useEffect, useCallback,
} from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ChannelContainer,
  MainContent,
} from './styles';
import { getChannelData, getChannelMessagesData } from '../../redux/reducers';
import Chat from '../Chat';
import {
  channelMessagesRequested,
  channelMoreMessagesRequested,
  deleteChannelMessage,
  removeChannelMessageObjectUrl,
  retryFailedChannelMessage,
  sendChannelMessageRequested,
} from '../../redux/actions/channels';
import { MessageType } from '../../constants/Message';
import { getFileDimensions } from '../../utils/helperFunctions';
import MessageProvider from '../../providers/MessageProvider';
import NotFound from '../NotFound';
import MembersDrawer from './MembersDrawer';
import { removeChannelNotifications } from '../../redux/actions/notifications';

const emptyChannel = {
  error: null,
  data: [],
  isLoading: true,
  hasMore: true,
};

const dimensionsSupportedTypes = [MessageType.IMAGE, MessageType.VIDEO];

// on server change, channel will unmount and remount, as user gets navigated
// to new server initally with no channelId, and then navigated to first channel of server
const Channel = (props) => {
  // const params = useParams();
  const { serverId, channelId } = useParams();
  const channel = useSelector((state) => getChannelData(state, serverId, channelId));
  const messagesData = useSelector((state) => getChannelMessagesData(state, serverId, channelId))
    ?? emptyChannel;
  const dispatch = useDispatch();

  const {
    setOpenedChannel,
    closeMembersDrawer,
    isExploringServer,
    isMembersDrawerOpen,
    members,
  } = useOutletContext();

  const fetchChannelMessages = () => {
    dispatch(channelMessagesRequested(serverId, channelId));
  };

  useEffect(() => {
    if (serverId && channel?.id) {
      // whenever these change, fetch messages and remove notifications
      fetchChannelMessages();
      dispatch(removeChannelNotifications(serverId, channel.id));
    }
  }, [serverId, channel?.id]);

  useEffect(() => {
    if (channel?.name) {
      setOpenedChannel(channel);
      return;
    }
    setOpenedChannel({});
  }, [channel?.name, channel?.type]);

  const sendMessage = async (content) => {
    if (isExploringServer) return;
    const messageObj = content;
    if (dimensionsSupportedTypes.includes(messageObj.type)) {
      messageObj.fileDimensions = await getFileDimensions(messageObj);
    }
    dispatch(sendChannelMessageRequested(serverId, channelId, messageObj));
  };

  const getMoreChannelMessages = () => {
    dispatch(channelMoreMessagesRequested(serverId, channelId));
  };

  const retryFailedMessage = useCallback((messageObj) => {
    dispatch(retryFailedChannelMessage(serverId, channelId, messageObj));
  }, [dispatch, serverId, channelId]);

  const removeObjectUrl = useCallback((messageId) => {
    dispatch(removeChannelMessageObjectUrl(serverId, channelId, messageId));
  }, [dispatch, serverId, channelId]);

  // TODO: for now only deleting failed messages,
  // server delete support will be added in future
  const deleteMessage = useCallback((messageId) => {
    dispatch(deleteChannelMessage(serverId, channelId, messageId));
  }, [serverId, channelId]);

  const messageProviderValue = useMemo(() => ({
    removeObjectUrl,
    retryFailedMessage,
    deleteMessage,
  }), [removeObjectUrl]);

  const renderContent = () => {
    if (!channel) return <NotFound />;
    return (
      <MessageProvider value={messageProviderValue}>
        <Chat
          messagesData={messagesData}
          sendMessage={sendMessage}
          loadMoreMessages={getMoreChannelMessages}
          retryFailedMessage={retryFailedMessage}
          hideInput={isExploringServer}
          chatBoxId={channelId}
          fetchMessages={fetchChannelMessages}
          chatName={channel.name}
        />
      </MessageProvider>
    );
  };

  return (
    <ChannelContainer>
      <MainContent isDrawerOpen={isMembersDrawerOpen}>
        {renderContent()}
      </MainContent>

      <MembersDrawer
        isMembersDrawerOpen={isMembersDrawerOpen}
        closeMembersDrawer={closeMembersDrawer}
        isExploringServer={isExploringServer}
        members={members}
      />
    </ChannelContainer>
  );
};

Channel.propTypes = {

};

export default memo(Channel);
