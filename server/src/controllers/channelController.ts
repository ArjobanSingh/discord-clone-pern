import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { Server } from 'socket.io';
import * as C from '../../../common/socket-io-constants';
import Channel from '../entity/Channel';
import Message from '../entity/Message';
import ServerMember from '../entity/ServerMember';
import { SendMessageInput } from '../types/ChannelMessageInput';
import { createValidationError, CustomError } from '../utils/errors';

export const sendChannelMessageRest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      serverId,
      sid,
    } = req.body;
    console.log('req body', req.body);
    const io: Server = req.app.get('io');
    const currentSocket = io.sockets.sockets.get(sid);

    console.log('current socket', currentSocket.rooms);
    currentSocket.broadcast.to(serverId).emit(C.NEW_CHANNEL_MESSAGE, req.body);
    res.json({});
  } catch (err) {
    next(err);
  }
};
// TODO: handle file messages and validation
// export async function sendChannelMessage(data: SendMessageInput) {
//   const {
//     socket,
//     userId,
//     channelMessageInput,
//     doneCallback,
//   } = data;

//   try {
//     const { serverId, channelId, messageData } = channelMessageInput;
//     const { content, type } = messageData;
//     const serverMember = await ServerMember.findOne({
//       where: { userId, serverId },
//     });

//     if (!serverMember) {
//       doneCallback(new CustomError('You are not part of this server', 401), undefined);
//       return;
//     }

//     const channel = await Channel.findOne(channelId);

//     if (!channel) {
//       doneCallback(new CustomError('Channel Not found', 404), undefined);
//       return;
//     }

//     const message = new Message();
//     message.content = content;
//     message.type = type;
//     message.userId = userId;
//     message.channel = channel;
//     message.channelId = channelId;

//     const errors = await validate(message);

//     if (errors.length) {
//       const { error, status } = createValidationError(errors);
//       doneCallback(new CustomError('Something went wrong', status), undefined);

//       return;
//     }
//   } catch (err) {
//     console.log('Channel Message sending error: ', err);
//     doneCallback(new CustomError('Something went wrong', 500), undefined);
//   }
// }
export function updateChannelMessage() {}
