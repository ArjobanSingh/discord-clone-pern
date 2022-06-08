import { isUUID } from 'class-validator';
import { NextFunction, Response } from 'express';
import { nanoid } from 'nanoid';
import { LessThan } from 'typeorm';
import AppDataSource from '../data-source';
import InviteLink, { MAX_MINUTE_LIMIT, MIN_MINUTE_LIMIT } from '../entity/InviteLink';
import { ServerTypeEnum } from '../entity/Server';
import { enumScore, MemberRole } from '../entity/ServerMember';
import CustomRequest from '../interfaces/CustomRequest';
import { CustomError } from '../utils/errors';
import { getServerForJoinLink } from '../utils/helperFunctions';

export const createInvite = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { serverId, minutes } = req.body;

    const numberOfMinutes = parseInt(minutes, 10);
    let validMinutes = Number.isNaN(numberOfMinutes) || numberOfMinutes > MAX_MINUTE_LIMIT
      ? MAX_MINUTE_LIMIT : numberOfMinutes;

    if (validMinutes < MIN_MINUTE_LIMIT) validMinutes = MIN_MINUTE_LIMIT;

    if (!serverId || !isUUID(serverId)) {
      next(new CustomError('Invalid serverId', 400));
      return;
    }

    const [serverDetails] = await AppDataSource.query(`
      Select s.id as "serverId", s.type, sm.role
      from server "s"
      join server_member "sm"
      on s.id = sm."serverId"
      where s.id = $1 and sm."userId" = $2
      limit 1;
    `, [serverId, req.userId]);

    // either server not found, or user not part of this server
    if (!serverDetails) {
      next(new CustomError('Not found', 404));
      return;
    }
    // const server = await Server.findOne(serverId);
    // const serverMember = await ServerMember.findOne({
    //   where: { userId: req.userId, serverId },
    // });

    // only people with role of MOD and above can generate invite link
    if (serverDetails.type === ServerTypeEnum.PRIVATE
        && enumScore[serverDetails.role] < enumScore[MemberRole.MODERATOR]) {
      next(new CustomError('Forbidden', 403));
      return;
    }

    let link = await InviteLink.findOne({ where: { serverId, minutes: validMinutes } });

    // if not found, create new link
    if (!link) {
      link = new InviteLink();
      link.minutes = validMinutes;
      link.serverId = serverId;
    }

    // if creating new link or editing previous expired link, create new link path and expiration date
    if (!link.expireAt || link.isExpired()) {
      const date = new Date();
      date.setMinutes(date.getMinutes() + validMinutes);
      link.expireAt = date;
      link.urlPath = nanoid();
      // const errors = await validate(link);
      await link.save();
    }

    res.json({
      inviteUrl: link.urlPath,
      expireAt: link.expireAt,
      minutes: link.minutes,
      serverId: link.serverId,
    });

    // delete all expired links, after sending response to user
    InviteLink.delete({ expireAt: LessThan(new Date()) });
  } catch (err) {
    next(err);
  }
};

export const verifyUrl = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { inviteLink } = req.params;
    if (!inviteLink) {
      next(new CustomError('Link Not found', 404));
      return;
    }
    const server = await getServerForJoinLink(inviteLink);

    res.json(server);
  } catch (err) {
    next(err);
  }
};
