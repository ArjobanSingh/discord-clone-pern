import { NextFunction, Response } from 'express';
import { validate } from 'class-validator';
import Server from '../entity/Server';
import CustomRequest from '../interfaces/CustomRequest';
import { createValidationError } from '../utils/errors';
import ServerMember from '../entity/ServerMember';
import User from '../entity/User';
import { addServerMembers } from '../utils/helperFunctions';

export const createServer = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, body } = req;

    const user = await User.findOne(userId);
    const newServer = new Server();
    newServer.name = body.name;
    newServer.ownerId = userId;

    const errors = await validate(newServer);

    if (errors.length) {
      next(createValidationError(errors));
      return;
    }

    const serverMember = new ServerMember();
    serverMember.isAdmin = true;
    serverMember.user = user;
    serverMember.server = newServer;

    await newServer.save();
    await serverMember.save();

    res.json(addServerMembers(newServer, [user]));
  } catch (err) {
    next(err);
  }
};

export const joinServer = (req: CustomRequest, res: Response, next: NextFunction) => {};
