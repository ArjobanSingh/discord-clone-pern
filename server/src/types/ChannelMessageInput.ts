import { MessageTypeEnum } from '../entity/Message';

type MessageData = {
  type: MessageTypeEnum;
  content: string;
}

export default MessageData;
