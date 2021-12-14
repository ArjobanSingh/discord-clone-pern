import { NextFunction, Response } from 'express';
import { validate } from 'class-validator';
import { getConnection } from 'typeorm';
import Server from '../entity/Server';
import CustomRequest from '../interfaces/CustomRequest';
import { createValidationError, CustomError } from '../utils/errors';
import ServerMember from '../entity/ServerMember';
import User from '../entity/User';
import { addServerMembers } from '../utils/helperFunctions';

export const createServer = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, body } = req;

    const user = await User.findOne(userId);
    const newServer = new Server();
    newServer.name = body.name;
    newServer.owner = user;

    const errors = await validate(newServer);

    if (errors.length) {
      next(createValidationError(errors));
      return;
    }

    const serverMember = new ServerMember();
    serverMember.isAdmin = true;
    serverMember.user = user;
    serverMember.server = newServer;

    await getConnection().transaction(async (transactionEntityManager) => {
      await transactionEntityManager.save(newServer);
      await transactionEntityManager.save(serverMember);
    });
    const { owner, ...otherSeverProps } = newServer;

    res.status(201).json(addServerMembers(otherSeverProps, [user]));
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

// TODO: make this paginated
export const getAllServers = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const servers = await Server.find();
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
        'userName', u.name, 'userId', u.id, 'profilePicture', u."profilePicture", 'isAdmin', sm."isAdmin"
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
