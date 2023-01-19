import { NextFunction, Response, Express } from 'express';
import {
  isString, isURL, isUUID, validate,
} from 'class-validator';
import { Server as SocketServer } from 'socket.io';
import sharp from 'sharp';
import {
  FindManyOptions, In, LessThan, // getConnection,
} from 'typeorm';
import Server, { ServerTypeEnum } from '../entity/Server';
import CustomRequest from '../interfaces/CustomRequest';
import { createValidationError, CustomError } from '../utils/errors';
import ServerMember, { enumScore, MemberRole } from '../entity/ServerMember';
import User from '../entity/User';
import { AllServersQuery } from '../types/ServerTypes';
import { getServerForJoinLink, updateServerFile } from '../utils/helperFunctions';
import Channel from '../entity/Channel';
import cloudinary from '../cloudinary';
import * as C from '../utils/socket-io-constants';
import { getServerData, ServerData } from '../utils/typeormHelpers';
import ISocket from '../types/ISocket';
import AppDataSource from '../data-source';

export const createServer = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, body } = req;

    const user = await User.findOneBy({ id: userId });
    const { avatar, description } = body;

    const newServer = new Server();
    newServer.name = body.name;
    newServer.owner = user;
    newServer.type = body.type || ServerTypeEnum.PUBLIC;
    newServer.memberCount = 1;
    newServer.channelCount = 1;
    // newServer.banner = banner;
    newServer.description = description;

    if (isString(avatar) && isURL(avatar)) newServer.avatar = avatar;

    const errors = await validate(newServer);

    if (errors.length) {
      next(createValidationError(errors));
      return;
    }

    const serverMember = new ServerMember();
    serverMember.role = MemberRole.OWNER;
    serverMember.user = user;
    serverMember.server = newServer;

    const generalChannel = new Channel();
    generalChannel.name = 'general';
    generalChannel.server = newServer;

    if (req.file) {
      const { buffer } = req.file;
      const jpegBuffer = await sharp(buffer)
        .jpeg({ mozjpeg: true, quality: 90 })
        .toBuffer();

      const base64String = `data:image/jpeg;base64,${jpegBuffer.toString('base64')}`;
      const fileResponse = await cloudinary.uploader.upload(
        base64String,
        { folder: 'discord_clone/api_uploads/server-files' },
      );
      const { secure_url: secureUrl, public_id: publicId } = fileResponse;
      newServer.avatar = secureUrl;
      newServer.avatarPublicId = publicId;
    }

    await AppDataSource.transaction(async (transactionEntityManager) => {
      // need to save server before following two promises
      await transactionEntityManager.save(newServer);
      const saveMemberPromise = transactionEntityManager.save(serverMember);
      const saveChannelPromise = transactionEntityManager.save(generalChannel);

      await saveMemberPromise;
      await saveChannelPromise;
    });

    const { owner: _, ...otherSeverProps } = newServer;
    const { server: _s, serverId: _sId, ...restChannelData } = generalChannel;

    const reponseObj = {
      ...otherSeverProps,
      members: [{
        userId: user.id,
        userName: user.name,
        profilePicture: user.profilePicture,
        role: MemberRole.OWNER,
      }],
      channels: [restChannelData],
    };

    res.status(201).json(reponseObj);
    const io: SocketServer = req.app.get('io');

    // find all socket client connections of owner and send new server notification to them
    const allSockets = io.sockets.sockets;

    const allSocketsArr = Array.from(allSockets.entries());
    allSocketsArr.forEach((socket: [string, ISocket]) => {
      const [, socketDetails] = socket;
      if (socketDetails.userId === req.userId) {
        io.to(socketDetails.id).emit(C.SERVER_CREATED, reponseObj);
      }
    });
  } catch (err) {
    next(err);
  }
};

export const joinServer = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, query } = req;

    let server: ServerData | undefined;

    if (query.inviteLink) {
      // user trying to join with invite link
      server = await getServerForJoinLink(`${query.inviteLink}`);
    } else if (!query.serverId || !isUUID(query.serverId)) {
      // user in not trying to join with link and serverId is also not valid or present
      // so throw error
      next(new CustomError('Invalid serverId', 400));
      return;
    } else {
      // valid serverId, so find the corresponding server
      // server = await Server.findOne(`${query.serverId}`, {
      //   relations: ['serverMembers', 'serverMembers.user', 'channels'],
      // });

      server = await getServerData(`${query.serverId}`);
      if (!server) {
        next(new CustomError('No server found', 404));
        return;
      }

      // if user is trying to join server with serverId, and that server is private
      // return error, private servers can only be joined with join links
      if (server.type === ServerTypeEnum.PRIVATE) {
        // use cannot automatically join private servers
        next(new CustomError('Forbidden', 403));
        return;
      }
    }

    const isServerMemberAlreadyPresent = server.members.find((mem) => mem.userId === userId);
    if (isServerMemberAlreadyPresent) {
      // user already in this group
      next(new CustomError('You are already part of this server', 400));
      return;
    }

    const user = await User.findOneBy({ id: userId });

    const serverMember = new ServerMember();
    serverMember.user = user;
    serverMember.server = server;

    // either save or fail both
    await AppDataSource.transaction(async (transactionEntityManager) => {
      const addMemberPromise = transactionEntityManager.insert(ServerMember, serverMember);
      const updateServerPromise = transactionEntityManager.update(Server, server.id, {
        memberCount: () => '"memberCount" + 1',
      });
      await addMemberPromise;
      await updateServerPromise;
    });

    const newMemberObj = {
      userName: user.name,
      userId: user.id,
      profilePicture: user.profilePicture,
      role: MemberRole.USER,
    };

    server.members.push(newMemberObj);

    res.status(201).json(server);

    // extracting out heavy json items like channels and members for socket payload
    const { channels: _c, members: _m, ...restServerDetails } = server;

    const io: SocketServer = req.app.get('io');
    io.to(server.id).emit(C.NEW_SERVER_MEMBER_JOINED, {
      server: restServerDetails,
      newMember: newMemberObj,
    });

    const allSockets = io.sockets.sockets;

    const allSocketsArr = Array.from(allSockets.entries());
    // send joined server notification to every socket client
    // of the current joined user
    allSocketsArr.forEach((data) => {
      const socketDetails: ISocket = data[1];
      if (socketDetails.userId === newMemberObj.userId) {
        io.to(socketDetails.id).emit(C.NEW_SERVER_MEMBER_JOINED, {
          server: restServerDetails,
          newMember: newMemberObj,
        });
      }
    });
  } catch (err) {
    next(err);
  }
};

export const leaveServer = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { serverId } = req.params;
    if (!serverId || !isUUID(serverId)) {
      next(new CustomError('Invalid serverId', 400));
      return;
    }

    const [server] = await AppDataSource.query(`
      SELECT s.id, s."ownerId", u.name as "userName"
      FROM server s
      INNER JOIN server_member sm ON sm."serverId" = s.id
      INNER JOIN users u ON u.id = sm."userId"
      WHERE s.id = $1 AND sm."userId" = $2
      LIMIT 1;
    `, [serverId, req.userId]);

    if (!server) {
      // no corresponding server, nothing to do
      res.status(204).json();
      return;
    }

    if (server.ownerId === req.userId) {
      next(new CustomError("Owner cannot leave it's own server", 403));
      return;
    }

    await AppDataSource.transaction(async (transactionEntityManager) => {
      const deleteMemberPromise = transactionEntityManager.delete(ServerMember, {
        serverId,
        userId: req.userId,
      });
      const serverUpdatePromise = transactionEntityManager.update(Server, serverId, {
        memberCount: () => '"memberCount" - 1',
      });

      await deleteMemberPromise;
      await serverUpdatePromise;
    });

    const { userName } = server;

    const responseObj = {
      userId: req.userId,
      userName,
      serverId,
    };

    res.json(responseObj);

    const io: SocketServer = req.app.get('io');
    io.to(serverId).emit(C.SERVER_MEMBER_LEFT, responseObj);
  } catch (err) {
    next(err);
  }
};

// TODO: make this paginated based on popularity or number of members in desc
export const getAllServers = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cursor, limit = '50' } = req.query as AllServersQuery;
    const limitNumber = parseInt(limit, 10);

    const take = Number.isNaN(limitNumber) || limitNumber > 50 ? 50 : limitNumber;
    const queryObj: FindManyOptions<Server> = {
      where: { type: ServerTypeEnum.PUBLIC },
      order: { createdAt: 'DESC' },
      take,
    };

    if (cursor && typeof cursor === 'string') {
      queryObj.where = {
        type: ServerTypeEnum.PUBLIC,
        // createdAt: LessThan(decodeURIComponent(cursor)),
        createdAt: LessThan(new Date(decodeURIComponent(cursor))),
      };
    }

    // console.log('Query obj', queryObj);

    const servers = await Server.find(queryObj);
    res.json(servers);
  } catch (err) {
    next(err);
  }
};

export const getServerDetails = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { serverId } = req.params;

    if (!serverId || !isUUID(serverId)) {
      next(new CustomError('No server found', 404));
      return;
    }

    // get server details it's channles and members
    const server = await getServerData(serverId);

    if (!server) {
      next(new CustomError('No server found', 404));
      return;
    }

    if (server.type === ServerTypeEnum.PRIVATE) {
      // if current server is private, and user in not part of server
      // throw error
      const thisMember = server.members.find(
        (member) => member.userId === req.userId,
      );
      if (!thisMember) {
        next(new CustomError('Forbidden', 403));
        return;
      }
    }

    // res.json({ ...server, channels: serverChannels });
    res.json(server);
  } catch (err) {
    next(err);
  }
};

export const updateServer = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      id: serverId,
      type,
      name,
      description,
      avatar,
      banner,
    } = req.body;

    if (!serverId || !isUUID(serverId)) {
      next(new CustomError('Invalid serverId', 400));
      return;
    }

    if (!type || !Object.values(ServerTypeEnum).includes(type)) {
      next(new CustomError('Invalid server type', 400));
      return;
    }

    let server = await Server.findOneBy({
      id: serverId,
    });

    if (!server) {
      next(new CustomError('Server not found', 404));
      return;
    }

    const serverMember = await ServerMember.findOneBy({ userId: req.userId, serverId });

    if (!serverMember || enumScore[serverMember.role] < enumScore[MemberRole.ADMIN]) {
      next(new CustomError('You do not have required permission for this action', 403));
      return;
    }

    const previousServerType = server.type;

    server.type = type;
    server.name = name;
    server.description = description ?? null;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const newAvatarPromise = updateServerFile(files.avatar, server, 'avatar', !avatar);
    const newBannerPromise = updateServerFile(files.banner, server, 'banner', !banner);

    const [newAvatarUrl, newAvatarPublicId] = await newAvatarPromise;
    const [newBannerUrl, newBannerPublicId] = await newBannerPromise;

    const { avatarPublicId, bannerPublicId } = server;

    // if we updated or removed banner/avatar, delete previous banner/avatar from hosting
    const prevAvatarPublicId = newAvatarPublicId !== avatarPublicId ? avatarPublicId : undefined;
    const prevBannerPublicId = newBannerPublicId !== bannerPublicId ? bannerPublicId : undefined;

    server.avatar = newAvatarUrl;
    server.avatarPublicId = newAvatarPublicId;

    server.banner = newBannerUrl;
    server.bannerPublicId = newBannerPublicId;

    const errors = await validate(server);

    if (errors.length) {
      next(createValidationError(errors));
      return;
    }

    // this executes select query again, so not using this while updating
    // await server.save();

    const resp = await AppDataSource.getRepository(Server)
      .createQueryBuilder()
      .update({
        type,
        name,
        description,
        avatar: newAvatarUrl,
        avatarPublicId: newAvatarPublicId,
        banner: newBannerUrl,
        bannerPublicId: newBannerPublicId,
      })
      .where({
        id: server.id,
      })
      .returning('*')
      .execute();

    [server] = resp.raw;

    res.json(server);

    const io: SocketServer = req.app.get('io');
    io.to(serverId).emit(C.SERVER_UPDATED, server);

    if (server.type === ServerTypeEnum.PRIVATE
      && previousServerType === ServerTypeEnum.PUBLIC) {
      // server updated to private
      io.emit(C.SERVER_UPDATED_TO_PRIVATE, { serverId });
    }
    // after response has been sent, delete previous avatar/banner if present
    if (prevAvatarPublicId) cloudinary.uploader.destroy(prevAvatarPublicId);
    if (prevBannerPublicId) cloudinary.uploader.destroy(prevBannerPublicId);
  } catch (err) {
    next(err);
  }
};

export const deleteServer = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { serverId } = req.params;

    if (!serverId || !isUUID(serverId)) {
      next(new CustomError('Invalid ServerId', 404));
      return;
    }

    const server = await Server.findOneBy({ id: serverId });

    if (!server) {
      next(new CustomError('No server found', 404));
      return;
    }

    if (server.ownerId !== req.userId) {
      next(new CustomError('Forbidden', 403));
      return;
    }
    const { avatarPublicId, bannerPublicId } = server;

    await Server.delete(serverId);

    res.status(204).json();

    const io: SocketServer = req.app.get('io');
    io.to(serverId).emit(C.SERVER_DELETED, { serverId });

    // after response has been sent, delete previous avatar/banner if present
    if (avatarPublicId) cloudinary.uploader.destroy(avatarPublicId);
    if (bannerPublicId) cloudinary.uploader.destroy(bannerPublicId);
  } catch (err) {
    next(err);
  }
};

export const updateServerMemberRoles = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { role, userId, serverId } = req.body;

    if (
      !role
      || !isUUID(serverId)
      || !isUUID(userId)
      || !Object.values(MemberRole).includes(role)
    ) {
      next(new CustomError('Invalid body', 400));
      return;
    }

    if (role === MemberRole.OWNER) {
      next(new CustomError('Cannot update owner for Server', 400));
      return;
    }

    const serverMembers = await ServerMember.find({
      where: { userId: In([req.userId, userId]), serverId },
      take: 2,
    });

    if (req.userId === userId) {
      next(new CustomError('Cannot update role', 400));
      return;
    }

    if (!serverMembers.length) {
      next(new CustomError('Server not found', 404));
      return;
    }

    if (serverMembers.length !== 2) {
      next(new CustomError('Server members not found', 404));
      return;
    }

    // requesting user: the one making this api request to update user role
    const requestingUser = serverMembers.find((u) => u.userId === req.userId);

    // requested user: the user, whose roles have to be updated
    const requestedUser = serverMembers.find((u) => u.userId === userId);

    // eg: mod cannot assign some user a role, which is greater than mode itself
    if (enumScore[requestingUser.role] < enumScore[role]) {
      // requesting user's role is smaller than the role he asked to update for other user
      next(new CustomError('Forbidden', 403));
      return;
    }

    // eh: mod cannot change role of any other mode, or user with higher role
    if (enumScore[requestingUser.role] <= enumScore[requestedUser.role]) {
      // requesting user's role is not greater than requested user's role
      // this operation is denied
      next(new CustomError('Forbidden', 403));
      return;
    }

    if (requestedUser.role !== role) {
      await ServerMember.update(
        { userId: requestedUser.userId, serverId },
        { role },
      );
    }

    const responseObj = {
      serverId,
      userId: requestedUser.userId,
      role,
    };

    res.status(200).json(responseObj);

    const io: SocketServer = req.app.get('io');
    io.to(serverId).emit(C.SERVER_MEMBER_ROLE_UPDATED, responseObj);
  } catch (err) {
    next(err);
  }
};

export const transferOwnership = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { serverId } = req.params;
    const { newOwnerId } = req.body;
    if (!isUUID(serverId)) {
      next(new CustomError('Server not found', 404));
      return;
    }

    if (!isUUID(newOwnerId)) {
      next(new CustomError('Invalid owner Id', 400));
      return;
    }

    // this will find the members of current server,
    // if there will be no server with serverId, or members not part of this
    // server it will return empty array, so checking all things
    const serverMembers = await ServerMember.find({
      where: { userId: In([req.userId, newOwnerId]), serverId },
      take: 2,
    });

    if (!serverMembers?.length) {
      next(new CustomError('Server not found', 404));
      return;
    }

    if (serverMembers.length !== 2) {
      next(new CustomError('Server members not found', 404));
      return;
    }

    const oldOwner = serverMembers.find((mem) => mem.userId === req.userId);
    const newOwner = serverMembers.find((mem) => mem.userId === newOwnerId);

    if (oldOwner.role !== MemberRole.OWNER) {
      next(new CustomError('Forbidden: You are not an owner', 403));
      return;
    }

    await AppDataSource.transaction(async (transactionEntityManager) => {
      const prevOwnerPromise = transactionEntityManager.update(ServerMember, {
        userId: oldOwner.userId,
        serverId,
      }, {
        role: MemberRole.ADMIN,
      });

      const newOwnerPromise = transactionEntityManager.update(ServerMember, {
        userId: newOwner.userId,
        serverId,
      }, {
        role: MemberRole.OWNER,
      });

      const serverPromise = transactionEntityManager.update(Server, serverId, {
        ownerId: newOwner.userId,
      });
      await prevOwnerPromise;
      await newOwnerPromise;
      await serverPromise;
    });

    const responseJSON = {
      updatedMembers: [
        { userId: newOwner.userId, role: MemberRole.OWNER },
        { userId: oldOwner.userId, role: MemberRole.ADMIN },
      ],
      serverId,
    };

    res.json(responseJSON);
    const io: SocketServer = req.app.get('io');
    io.to(serverId).emit(C.SERVER_OWNER_TRANSFERRED, responseJSON);
  } catch (err) {
    next(err);
  }
};

export const kickUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { serverId, userId } = req.params;

    // this will find the members of current server,
    // if there will be no server with serverId, or members not part of this
    // server it will return empty array, so checking all things
    const serverMembers = await AppDataSource.query(`
      SELECT sm.role, u.id as "userId", u.name as "userName"
      FROM users u
      INNER JOIN server_member sm
      ON u.id = sm."userId"
      WHERE (sm."userId" IN ($1, $2) AND sm."serverId" = $3)
      LIMIT 2;
    `, [req.userId, userId, serverId]);

    if (!serverMembers?.length) {
      next(new CustomError('Server not found', 404));
      return;
    }

    if (serverMembers.length !== 2) {
      next(new CustomError('Server members not found', 404));
      return;
    }

    // requesting user: the one making this api request to kick other user
    const requestingUser = serverMembers.find((u) => u.userId === req.userId);

    // requested user: the user, who will be kicked
    const requestedUser = serverMembers.find((u) => u.userId === userId);

    // eg: mod cannot kick any other user with equal or higher role
    if (enumScore[requestingUser.role] <= enumScore[requestedUser.role]) {
      next(new CustomError('Forbidden: You do not have access to kick this user', 403));
      return;
    }

    await AppDataSource.transaction(async (transactionEntityManager) => {
      const removeUserPromise = transactionEntityManager.delete(ServerMember, {
        serverId,
        userId,
      });
      const countUpdatePromise = transactionEntityManager.update(Server, serverId, {
        memberCount: () => '"memberCount" - 1',
      });

      await removeUserPromise;
      await countUpdatePromise;
    });

    const responseObj = {
      userId,
      userName: requestedUser.userName,
      serverId,
    };

    res.json(responseObj);

    const io: SocketServer = req.app.get('io');
    io.to(serverId).emit(C.SERVER_USER_KICKED_OUT, responseObj);
  } catch (err) {
    next(err);
  }
};
