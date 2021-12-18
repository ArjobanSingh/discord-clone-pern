import { NextFunction, Response } from 'express';
import { validate } from 'class-validator';
import { FindManyOptions, getConnection, LessThan } from 'typeorm';
import Server, { ServerTypeEnum } from '../entity/Server';
import CustomRequest from '../interfaces/CustomRequest';
import { createValidationError, CustomError } from '../utils/errors';
import ServerMember, { MemberRole } from '../entity/ServerMember';
import User from '../entity/User';
import { AllServersQuery } from '../types/ServerTypes';

export const createServer = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, body } = req;

    const user = await User.findOne(userId);

    const newServer = new Server();
    newServer.name = body.name;
    newServer.owner = user;
    newServer.type = body.type || ServerTypeEnum.PUBLIC;

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

    const { owner, ...otherSeverProps } = newServer;

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
    if (!query?.serverId) {
      next(new CustomError('No server found', 404));
      return;
    }

    const server = await Server.findOne(`${query.serverId}`);
    if (!server) {
      next(new CustomError('No server found', 404));
      return;
    }

    if (server.type === ServerTypeEnum.PRIVATE) {
      // use cannot automatically join private servers
      next(new CustomError('Forbidden', 403));
      return;
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

// TODO: make this paginated based on popularity or number of members in desc
export const getAllServers = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { cursor, limit = '20' } = req.query as AllServersQuery;
    const limitNumber = parseInt(limit, 10);

    const take = Number.isNaN(limitNumber) || limitNumber > 20 ? 20 : limitNumber;
    const queryObj: FindManyOptions = { order: { createdAt: 'DESC' }, take };

    if (cursor && typeof cursor === 'string') {
      queryObj.where = {
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

    if (!serverId) {
      next(new CustomError('No server found', 404));
      return;
    }

    // get server details and with all users which are part of this as members
    const [server] = await getConnection().query(`
      SELECT s.*,
      json_agg(json_build_object(
        'userName', u.name, 'userId', u.id, 'profilePicture', u."profilePicture", 'role', sm.role
      )) as members
      FROM server "s"
      INNER JOIN server_member "sm" ON  s.id = sm."serverId"
      INNER JOIN users "u" ON u.id = sm."userId"
      WHERE s.id = '${serverId}'
      group by s.id
      limit 1;
    `);

    if (!server) {
      next(new CustomError('No server found', 404));
      return;
    }
    res.json(server);
  } catch (err) {
    next(err);
  }
};

export const deleteServer = async (req: CustomRequest, res: Response, next: NextFunction) => {};
