import { NextFunction, Response } from 'express';
import {
  isString, isURL, isUUID, validate,
} from 'class-validator';
import {
  FindManyOptions, getConnection, In, LessThan,
} from 'typeorm';
import Server, { ServerTypeEnum } from '../entity/Server';
import CustomRequest from '../interfaces/CustomRequest';
import { createValidationError, CustomError } from '../utils/errors';
import ServerMember, { enumScore, MemberRole } from '../entity/ServerMember';
import User from '../entity/User';
import { AllServersQuery, ServerType } from '../types/ServerTypes';
import { getServerForJoinLink } from '../utils/helperFunctions';

export const createServer = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, body } = req;

    const user = await User.findOne(userId);
    const { avatar } = body;

    const newServer = new Server();
    newServer.name = body.name;
    newServer.owner = user;
    newServer.type = body.type || ServerTypeEnum.PUBLIC;
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

    await getConnection().transaction(async (transactionEntityManager) => {
      await transactionEntityManager.save(newServer);
      await transactionEntityManager.save(serverMember);
    });

    const { owner: _, ...otherSeverProps } = newServer;

    res.status(201).json({
      ...otherSeverProps,
      members: [{
        userName: user.name,
        userId: user.id,
        email: user.email,
        profilePicture: user.profilePicture,
        role: MemberRole.OWNER,
      }],
    });
  } catch (err) {
    next(err);
  }
};

export const joinServer = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, query } = req;

    let server: Server | undefined;

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
      server = await Server.findOne(`${query.serverId}`);
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

    let serverMember = await ServerMember.findOne({ where: { userId, serverId: server.id } });
    if (serverMember) {
      // user already in this group
      next(new CustomError('You are already part of this server', 400));
      return;
    }

    const user = await User.findOne(userId);

    serverMember = new ServerMember();
    serverMember.user = user;
    serverMember.server = server;

    await serverMember.save();

    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

export const leaveServer = async (req: CustomRequest, res: Response, next: NextFunction) => {
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
      next(new CustomError('Owner cannot leave it\'s own server', 403));
      return;
    }

    await ServerMember.delete({
      serverId,
      userId: req.userId,
    });

    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

// TODO: make this paginated based on popularity or number of members in desc
export const getAllServers = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { cursor, limit = '20' } = req.query as AllServersQuery;
    const limitNumber = parseInt(limit, 10);

    const take = Number.isNaN(limitNumber) || limitNumber > 20 ? 20 : limitNumber;
    const queryObj: FindManyOptions = {
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

    const servers = await Server.find(queryObj);
    res.json(servers);
  } catch (err) {
    next(err);
  }
};

export const getServerDetails = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { serverId } = req.params;

    if (!serverId || !isUUID(serverId)) {
      next(new CustomError('No server found', 404));
      return;
    }

    // get server details and with all users which are part of this as members
    const [server]: ServerType[] = await getConnection().query(`
      SELECT s.*,
      json_agg(json_build_object(
        'userName', u.name, 'userId', u.id, 'profilePicture', u."profilePicture", 'role', sm.role
      )) as members
      FROM server "s"
      INNER JOIN server_member "sm" ON  s.id = sm."serverId"
      INNER JOIN users "u" ON u.id = sm."userId"
      WHERE s.id = $1
      group by s.id
      limit 1;
    `, [serverId]);

    if (!server) {
      next(new CustomError('No server found', 404));
      return;
    }

    if (server.type === ServerTypeEnum.PRIVATE) {
      // if current server is private, and user in not part of server
      // throw error
      const thisMember = server.members.find((member) => member.userId === req.userId);
      if (!thisMember) {
        next(new CustomError('Forbidden', 403));
        return;
      }
    }
    res.json(server);
  } catch (err) {
    next(err);
  }
};

export const updateServer = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { serverId, type } = req.body;

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

    if (server.ownerId !== req.userId) {
      next(new CustomError('Forbidden', 403));
      return;
    }

    if (server.type !== type) {
      server.type = type;
      await server.save();
    }
    // const [response, responseLength] = await getConnection().query(`
    //   update server s
    //   set "type" =
    //     case
    //     when s."ownerId" = $1 then $2
    //     else s.type
    //   end
    //   where s.id = $3
    //   returning s.id;
    // `, [req.userId, type, serverId]);

    // if (!response || !responseLength) {
    //   next(new CustomError('Server not found', 404));
    //   return;
    // }

    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

export const deleteServer = async (req: CustomRequest, res: Response, next: NextFunction) => {
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
    await Server.delete(serverId);
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

export const updateServerMemberRoles = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { role, userId, serverId } = req.body;

    if (!role || !isUUID(serverId) || !isUUID(userId) || !Object.values(MemberRole).includes(role)) {
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
      await ServerMember.update({ userId: requestedUser.userId, serverId }, { role });
    }

    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
