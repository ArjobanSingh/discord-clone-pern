import { Socket } from 'socket.io';
import Message, { MessageTypeEnum } from '../entity/Message';
import { CustomError } from '../utils/errors';

type MessageData = {
  type: MessageTypeEnum;
  content: string;
}

type ChannelMessageInput = {
  serverId: string;
  channelId: string;
  messageData: MessageData;
}

export type ChannelMessageDoneCallback = (error: null | CustomError, data: Message | undefined) => void;
export type SendMessageInput = {
  socket: Socket;
  userId: string;
  channelMessageInput: ChannelMessageInput;
  doneCallback: ChannelMessageDoneCallback;
}

export default ChannelMessageInput;
