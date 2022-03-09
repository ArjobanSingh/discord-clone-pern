import { MessageTypeEnum } from '../entity/Message';

type MessageData = {
  type: MessageTypeEnum;
  content: string;
  referenceMessageId?: string;
}

export default MessageData;
