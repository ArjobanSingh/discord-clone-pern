import { NextFunction, Response, Express } from 'express';
import {
  isString, isURL, isUUID, validate,
} from 'class-validator';
import { Server as SocketServer } from 'socket.io';
import sharp from 'sharp';
import {
  FindManyOptions, getConnection, getRepository, In, LessThan,
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
import * as C from '../../../common/socket-io-constants';
import { getServerData, ServerData } from '../utils/typeormHelpers';

export const createServer = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, body } = req;

    const user = await User.findOne(userId);
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
      newServer.avatar = publicId;
    }

    await getConnection().transaction(async (transactionEntityManager) => {
      await transactionEntityManager.save(newServer);
      await transactionEntityManager.save(serverMember);
      await transactionEntityManager.save(generalChannel);
    });

    const { owner: _, ...otherSeverProps } = newServer;
    const { server: _s, serverId: _sId, ...restChannelData } = generalChannel;

    res.status(201).json({
      ...otherSeverProps,
      members: [
        {
          userName: user.name,
          userId: user.id,
          // email: user.email,
          profilePicture: user.profilePicture,
          role: MemberRole.OWNER,
        },
      ],
      channels: [restChannelData],
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
    // let serverMember = await ServerMember.findOne({
    //   where: { userId, serverId: server.id },
    // });
    if (isServerMemberAlreadyPresent) {
      // user already in this group
      next(new CustomError('You are already part of this server', 400));
      return;
    }

    const user = await User.findOne(userId);

    const serverMember = new ServerMember();
    serverMember.user = user;
    serverMember.server = server;

    // either save or fail both
    await getConnection().transaction(async (transactionEntityManager) => {
      const addMemberPromise = transactionEntityManager.insert(ServerMember, serverMember);
      const updateServerPromise = transactionEntityManager.update(Server, server.id, {
        memberCount: () => '"memberCount" + 1',
      });
      await addMemberPromise;
      await updateServerPromise;
    });

    server.members.push({
      userName: user.name,
      userId: user.id,
      profilePicture: user.profilePicture,
      role: MemberRole.USER,
    });

    res.status(201).json(server);
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

    const server = await Server.findOne(serverId);

    if (!server) {
      // no corresponding server, nothing to do
      res.status(204).json();
      return;
    }

    if (server.ownerId === req.userId) {
      // TODO: owner cannot leave server for now
      next(new CustomError("Owner cannot leave it's own server", 403));
      return;
    }

    await getConnection().transaction(async (transactionEntityManager) => {
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

    const responseObj = {
      userId: req.userId,
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
        createdAt: LessThan(decodeURIComponent(cursor)),
      };
    }

    console.log('Query obj', queryObj);

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

// TODO: add update raw query, to prevent extra get query on save
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

    const server = await Server.findOne(serverId);
    if (!server) {
      next(new CustomError('Server not found', 404));
      return;
    }

    const serverMember = await ServerMember.findOne({
      where: { userId: req.userId, serverId },
    });

    if (!serverMember || enumScore[serverMember.role] < enumScore[MemberRole.ADMIN]) {
      next(new CustomError('You do not have required permission for this action', 403));
      return;
    }

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

    await server.save();

    res.json(server);

    // after response has been sent, delete previous avatar/banner if present
    if (prevAvatarPublicId) cloudinary.uploader.destroy(prevAvatarPublicId);
    if (prevBannerPublicId) cloudinary.uploader.destroy(prevBannerPublicId);
  } catch (err) {
    next(err);
  }
};

// TODO: delete avatar and banner on delete
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

    const server = await Server.findOne(serverId);

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

    res.status(204).json();
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

    await getConnection().transaction(async (transactionEntityManager) => {
      const preOwnerPromise = transactionEntityManager.update(ServerMember, {
        userId: oldOwner.userId,
        serverId,
      }, {
        role: MemberRole.ADMIN,
      });

      const newOwnerPromise = transactionEntityManager.update(ServerMember, { userId: newOwner.userId, serverId }, {
        role: MemberRole.OWNER,
      });

      const serverPromise = transactionEntityManager.update(Server, serverId, {
        ownerId: newOwner.userId,
      });
      await preOwnerPromise;
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
    const serverMembers = await ServerMember.find({
      where: { userId: In([req.userId, userId]), serverId },
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

    // requesting user: the one making this api request to update user role
    const requestingUser = serverMembers.find((u) => u.userId === req.userId);

    // requested user: the user, whose roles have to be updated
    const requestedUser = serverMembers.find((u) => u.userId === userId);

    // eg: mod cannot kick any other user with equal or higher role
    if (enumScore[requestingUser.role] <= enumScore[requestedUser.role]) {
      next(new CustomError('Forbidden: You do not have access to kick this user', 403));
      return;
    }

    await getConnection().transaction(async (transactionEntityManager) => {
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
      serverId,
    };

    res.json(responseObj);

    const io: SocketServer = req.app.get('io');
    io.to(serverId).emit(C.SERVER_USER_KICKED_OUT, responseObj);
  } catch (err) {
    next(err);
  }
};
