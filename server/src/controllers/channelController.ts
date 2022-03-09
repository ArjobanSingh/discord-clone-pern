import { validate } from 'class-validator';
import { NextFunction, Response } from 'express';
import { Server as SocketServer } from 'socket.io';
import { FindManyOptions, getConnection, LessThan } from 'typeorm';
import * as C from '../../../common/socket-io-constants';
import Channel from '../entity/Channel';
import Message from '../entity/Message';
import CustomRequest from '../interfaces/CustomRequest';
import { createValidationError, CustomError } from '../utils/errors';
import MessageData from '../types/ChannelMessageInput';
import { ServerTypeEnum } from '../entity/Server';
import ServerMember from '../entity/ServerMember';

export const sendChannelMessageRest = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const {
      serverId,
      channelId,
      sid,
      messageData,
    } : {
      serverId: string;
      channelId: string;
      sid: string;
      messageData: MessageData;
    } = req.body;

    const io: SocketServer = req.app.get('io');
    const currentSocket = io.sockets.sockets.get(sid);

    // if current socket has it's userId as one of it's room,
    // means its valid
    const isSocketValid = currentSocket?.rooms?.has(req.userId);

    if (!isSocketValid) {
      next(new CustomError('Invalid connection', 400));
      return;
    }

    const serverMemberPromise = getConnection().query(`
      SELECT u.name as "userName", u.id as "userId", u."profilePicture"
      FROM users "u"
      INNER JOIN server_member "sm" ON u.id = sm."userId"
      WHERE sm."userId" = $1 AND sm."serverId" = $2
      limit 1;
    `,
    [req.userId, serverId]);

    // this will autmatically validate if channel is present
    // and that channel is in the server, user trying to send message
    const channelPromise = Channel.findOne({
      where: { id: channelId, serverId },
    });

    const [[serverMember], channel] = await Promise.all([serverMemberPromise, channelPromise]);

    if (!serverMember) {
      next(new CustomError('You are not part of this server', 401));
      return;
    }

    if (!channel) {
      next(new CustomError('Channel Not found', 404));
      return;
    }

    const { content, type } = messageData;

    const message = new Message();
    message.content = content;
    message.type = type;
    message.userId = req.userId;
    message.channelId = channelId;
    message.serverId = serverId;

    const errors = await validate(message);

    if (errors.length) {
      next(createValidationError(errors));
      return;
    }

    await message.save();

    const messageObj = {
      ...message,
      user: serverMember,
    };

    res.json(messageObj);

    currentSocket.broadcast.to(serverId).emit(C.NEW_CHANNEL_MESSAGE, messageObj);
  } catch (err) {
    next(err);
  }
};

export const getChannelMessages = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { cursor } = req.query;
    const { serverId, channelId } = req.params;

    const querObj: FindManyOptions<Message> = {
      where: { serverId, channelId },
      order: { createdAt: 'DESC' },
      take: 50,
    };

    if (cursor) {
      querObj.where = {
        serverId,
        channelId,
        createdAt: LessThan(decodeURIComponent(`${cursor}`)),
      };
    }

    const serverPromise = getConnection().query(`
      SELECT s.type, s.id as "serverId", ch.id as "channelId"
      FROM server "s"
      INNER JOIN channel "ch"
      ON ch."serverId" = s.id
      where s.id = $1 and ch.id = $2
      limit 1;
    `, [serverId, channelId]);

    const serverMemberPromise = ServerMember.findOne({
      serverId,
      userId: req.userId,
    });
    const messagesPromise = Message.find(querObj);

    const [[server], serverMember, messages] = await Promise.all(
      [serverPromise, serverMemberPromise, messagesPromise],
    );

    if (!server) {
      next(new CustomError('Server or Channel not found', 404));
      return;
    }

    if (server.type === ServerTypeEnum.PRIVATE && !serverMember) {
      // if server is private, and user is not part of server throw err
      next(new CustomError('You do not have access to this channel', 401));
      return;
    }

    res.json({ messages });
  } catch (err) {
    next(err);
  }
};
