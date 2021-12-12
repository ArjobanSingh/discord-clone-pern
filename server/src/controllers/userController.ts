import { NextFunction, Response } from 'express';
import { getConnection } from 'typeorm';
import Server from '../entity/Server';
import ServerMember from '../entity/ServerMember';
import User from '../entity/User';
import CustomRequest from '../interfaces/CustomRequest';
import { CustomError } from '../utils/errors';
import { createUserObject } from '../utils/helperFunctions';

export const getCurrentUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req;
    // const [user] = await getConnection().query(`
    // select u.*, sa.servers from users u
    // JOIN (Select sm."userId" as id,
    //   json_agg(
    //     json_build_object('serverName', s.name, 'serverId', s.id, 'ownerId', s."ownerId")
    //   ) as servers from server_member sm
    //   join server s on sm."serverId" = s.id
    //   Group by sm."userId") sa using (id)
    //   where u.id = '${userId}'
    //   limit 1;
    // `);

    const [user] = await getConnection().query(`
      SELECT u.*,
      json_agg(json_build_object('serverName', s.name, 'serverId', s.id, 'ownerId', s."ownerId")) as servers
      FROM users "u"
      INNER JOIN server_member "sm" ON  "u"."id" = sm."userId"
      INNER JOIN server "s" ON "s"."id" = sm."serverId"
      WHERE "u"."id" = '${userId}'
      group by u.id
      limit 1;
    `);

    if (!user) {
      next(new CustomError('No user found', 404));
      return;
    }
    res.json(createUserObject(user, user.servers));
  } catch (err) {
    next(err);
  }
};

export const getUserById = (req: CustomRequest, res: Response) => {};
