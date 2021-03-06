import { isUUID, validate, isString } from 'class-validator';
import { NextFunction, Response } from 'express';
import { Server as SocketServer } from 'socket.io';
import sharp from 'sharp';
// import { getConnection, getRepository } from 'typeorm';
import { UploadApiOptions } from 'cloudinary';
import cloudinary from '../cloudinary';
import * as C from '../utils/socket-io-constants';
import Channel from '../entity/Channel';
import Message, { MessageTypeEnum } from '../entity/Message';
import CustomRequest from '../interfaces/CustomRequest';
import { createValidationError, CustomError } from '../utils/errors';
import MessageData from '../types/ChannelMessageInput';
import Server, { ServerTypeEnum } from '../entity/Server';
import ServerMember, { enumScore, MemberRole } from '../entity/ServerMember';
import { getFileName, getMessageType } from '../utils/helperFunctions';
import AppDataSource from '../data-source';

export const sendChannelMessage = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { jsonData } : { jsonData: string } = req.body;

    const {
      serverId,
      channelId,
      sid,
      messageData,
    }: {
      serverId: string;
      channelId: string;
      sid: string;
      messageData: MessageData;
    } = JSON.parse(jsonData);

    const { content, type } = messageData;

    if (!Object.values(MessageTypeEnum).includes(type)) {
      next(new CustomError('Invalid message type', 400));
      return;
    }

    if (type === MessageTypeEnum.TEXT) {
      if (!isString(content) || !content.trim()) {
        next(new CustomError('Content is required in Text message', 400));
        return;
      }
    }

    const io: SocketServer = req.app.get('io');
    const currentSocket = io.sockets.sockets.get(sid);

    // if current socket has it's userId as one of it's room,
    // means its valid
    const isSocketValid = currentSocket?.rooms?.has(req.userId);

    if (!isSocketValid) {
      next(new CustomError('Invalid connection', 400));
      return;
    }

    const promisesArray = [];

    const serverMemberPromise = AppDataSource.query(`
      SELECT u.name, u.id, u."profilePicture"
      FROM users "u"
      INNER JOIN server_member "sm" ON u.id = sm."userId"
      WHERE sm."userId" = $1 AND sm."serverId" = $2
      limit 1;
    `,
    [req.userId, serverId]);
    promisesArray.push(serverMemberPromise);

    // this will autmatically validate if channel is present
    // and that channel is in the server, user trying to send message
    const channelPromise = Channel.findOne({
      where: { id: channelId, serverId },
    });
    promisesArray.push(channelPromise);

    if (messageData.referenceMessageId) {
      const referenceMessagePromise = AppDataSource.getRepository(Message)
        .createQueryBuilder('refMsg')
        .select(['refMsg', 'user.name', 'user.id', 'user.profilePicture'])
        .innerJoin('refMsg.user', 'user')
        .where('refMsg.id = :referenceMessageId', { referenceMessageId: messageData.referenceMessageId })
        .getOne();
      promisesArray.push(referenceMessagePromise);
    }

    const [[serverMember], channel, referenceMessage] = await Promise.all(promisesArray);

    if (!serverMember) {
      next(new CustomError('You are not part of this server', 401));
      return;
    }

    if (!channel) {
      next(new CustomError('Channel Not found', 404));
      return;
    }

    // if user is replying to some other(reference) message
    // and we did not found reference message, throw error
    if (promisesArray.length === 3 && !referenceMessage) {
      next(new CustomError('Reference message not found', 404));
      return;
    }

    const message = new Message();
    if (content) message.content = content; // optional in non text messages
    message.type = type;
    message.userId = req.userId;
    message.channelId = channelId;
    message.serverId = serverId;

    if (type !== MessageTypeEnum.TEXT) {
      if (!req.file) {
        next(new CustomError('Media file not present', 400));
        return;
      }
      // const base64File = req.file.buffer.toString('base64');
      if (!req.file.mimetype) {
        next(new CustomError('Unsupported mimeType', 400));
        return;
      }
      const [fileType, cloudinaryResourceType] = getMessageType(req.file.mimetype);
      const { buffer, originalname } = req.file;

      let fileBuffer = buffer;

      message.type = fileType;
      message.fileName = getFileName(originalname);
      message.fileMimeType = req.file.mimetype;

      if (fileType === MessageTypeEnum.IMAGE) {
        let thumbnailBuffer: Buffer;
        const thumbnailPromise = sharp(buffer)
          .resize(200, 200)
          .blur(5)
          .webp({ quality: 50 })
          .toBuffer();

        const jpegBufferPromise = sharp(buffer)
          .jpeg({ mozjpeg: true, quality: 80 })
          .toBuffer();

        ([thumbnailBuffer, fileBuffer] = await Promise.all([thumbnailPromise, jpegBufferPromise]));

        // setting size of modified image
        message.fileMimeType = 'image/jpeg';
        message.fileThumbnail = thumbnailBuffer.toString('base64');
      }

      const base64String = `data:${message.fileMimeType};base64,${fileBuffer.toString('base64')}`;
      const cloudinayObj: UploadApiOptions = {
        folder: 'discord_clone/api_uploads',
        resource_type: cloudinaryResourceType,
      };
      if (message.type === MessageTypeEnum.FILE) {
        cloudinayObj.public_id = message.fileName;
      }
      const fileResponse = await cloudinary.uploader.upload(base64String, cloudinayObj);

      if (fileResponse.width && fileResponse.height) {
        // const dimensions = calculateAspectRatioFit(fileResponse.width, fileResponse.height);
        // message.fileDimensions = `${dimensions.width} ${dimensions.height}`;

        // set original dimensions
        message.fileDimensions = `${fileResponse.width} ${fileResponse.height}`;
      }

      const { bytes, secure_url: secureUrl, public_id: publicId } = fileResponse;

      message.fileSize = bytes;
      message.fileUrl = secureUrl;
      message.filePublicId = publicId;
    }

    if (referenceMessage) {
      message.referenceMessageId = referenceMessage.id;
      message.referenceMessage = referenceMessage;
    }

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

    res.status(201).json(messageObj);

    currentSocket.broadcast.to(serverId).emit(C.NEW_CHANNEL_MESSAGE, messageObj);
  } catch (err) {
    next(err);
  }
};

export const getChannelMessages = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { cursor } = req.query;
    const { serverId, channelId } = req.params;

    const messagesPromise = AppDataSource.getRepository(Message)
      .createQueryBuilder('message')
      .select(['message', 'user.name', 'user.id', 'user.profilePicture',
        'refMsg', 'refMsgUser.name', 'refMsgUser.id', 'refMsgUser.profilePicture'])
      .innerJoin('message.user', 'user')
      .leftJoin('message.referenceMessage', 'refMsg')
      .leftJoin('refMsg.user', 'refMsgUser')
      .where('message.serverId = :serverId', { serverId })
      .andWhere('message.channelId = :channelId', { channelId })
      .andWhere(cursor ? 'message.createdAt < :cursor' : '1=1', { cursor: decodeURIComponent(`${cursor}`) })
      .orderBy('message.createdAt', 'DESC')
      .limit(50)
      .getMany();

    const serverPromise = AppDataSource.query(`
      SELECT s.type, s.id as "serverId", ch.id as "channelId"
      FROM server "s"
      INNER JOIN channel "ch"
      ON ch."serverId" = s.id
      where s.id = $1 and ch.id = $2
      limit 1;
    `, [serverId, channelId]);

    const serverMemberPromise = ServerMember.findOne({
      where: {
        serverId,
        userId: req.userId,
      },
    });

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

export const createChannel = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { type, name, serverId } = req.body;
    if (!serverId || !isUUID(serverId)) {
      next(new CustomError('Invalid serverId', 400));
      return;
    }
    const serverMember = await ServerMember.findOne({ where: { serverId, userId: req.userId } });
    if (!serverMember) {
      next(new CustomError('You are not part of this server', 403));
      return;
    }

    // only admin and owner can create channels
    if (enumScore[serverMember.role] < enumScore[MemberRole.ADMIN]) {
      next(new CustomError('You do not have permission for creating channel in this server', 403));
      return;
    }

    const channel = new Channel();
    channel.name = name;
    channel.serverId = serverId;

    // TODO: uncomment when audio channels are available
    // as by default channel type would be TEXT
    // if (type) channel.type = type;

    const errors = await validate(channel);

    if (errors.length) {
      next(createValidationError(errors));
      return;
    }

    // either save or fail both
    await AppDataSource.transaction(async (transactionEntityManager) => {
      const addChannelPromise = transactionEntityManager.save(channel);
      const updateServerPromise = transactionEntityManager.update(Server, serverId, {
        channelCount: () => '"channelCount" + 1',
      });
      await addChannelPromise;
      await updateServerPromise;
    });

    res.status(201).json(channel);

    const io: SocketServer = req.app.get('io');
    io.to(serverId).emit(C.SERVER_CHANNEL_CREATED, { channel });
  } catch (err) {
    next(err);
  }
};

export const deleteChannel = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { serverId, channelId } = req.params;

    const serverMember = await ServerMember.findOne({ where: { serverId, userId: req.userId } });
    if (!serverMember) {
      next(new CustomError('You are not part of this server', 403));
      return;
    }

    // only admin and owner can delete channels
    if (enumScore[serverMember.role] < enumScore[MemberRole.ADMIN]) {
      next(new CustomError('You do not have permission for deleting this channel', 403));
      return;
    }

    await AppDataSource.transaction(async (transactionEntityManager) => {
      const removeChannelPromise = transactionEntityManager.delete(Channel, {
        id: channelId,
        serverId,
      });
      const countUpdatePromise = transactionEntityManager.update(Server, serverId, {
        channelCount: () => '"channelCount" - 1',
      });

      await removeChannelPromise;
      await countUpdatePromise;
    });

    const responseObj = {
      serverId,
      channelId,
    };
    res.json(responseObj);

    const io: SocketServer = req.app.get('io');
    io.to(serverId).emit(C.SERVER_CHANNEL_DELETED, responseObj);
  } catch (err) {
    next(err);
  }
};
