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

    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
};
