import { Express } from 'express';
import { nanoid } from 'nanoid';
import sharp from 'sharp';
import cloudinary from '../cloudinary';
import InviteLink from '../entity/InviteLink';
import { MessageTypeEnum } from '../entity/Message';
import Server from '../entity/Server';
import LoginDataType from '../interfaces/LoginData';
import redisClient from '../redisConfig';
import { CustomError } from './errors';
import { getServerData, ServerData } from './typeormHelpers';

const jwt = require('jsonwebtoken');

export const MAX_REFRESH_TOKENS_LIMIT_PER_USER = 20;

const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
} = process.env;

const verifyWithPromise = (token: string, secret: string) => new Promise((resolve, reject) => {
  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) reject(err);
    else resolve(decodedToken);
  });
});

const createAccessToken = (userId: string) => (
  jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION })
);
const createRefreshToken = (userId: string) => (
  jwt.sign({ userId, uniqueCreationId: nanoid(17) },
    REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION })
);

const verfifyToken = async (token: string, isAccessToken = true): Promise<any> => {
  const secret = isAccessToken ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;
  const payload = await verifyWithPromise(token, secret);
  return payload;
};

const decodeJWT = (token: string) => jwt.decode(token);

const createLoginData = async (userId: string): Promise<LoginDataType> => {
  const accessToken = createAccessToken(userId);
  const refreshToken = createRefreshToken(userId);

  const { exp, uniqueCreationId } = decodeJWT(refreshToken);

  // save refresh token's uniqueCreationId in redis for this user, as it will unique
  // and we would not need to store whole refresh token in redis
  // console.time('redis hset');
  redisClient.hset(userId, uniqueCreationId, exp);
  await redisClient.expireat(userId, exp);
  // console.timeEnd('redis hset');

  return { accessToken, refreshToken };
};

const getServerForJoinLink = async (inviteLink: string): Promise<ServerData> => {
  if (inviteLink.length !== 21) {
    throw new CustomError('Invalid Join Link', 400);
  }
  const link = await InviteLink.findOne({ where: { urlPath: inviteLink } });
  if (!link) {
    throw new CustomError('Link not found', 404);
  }

  if (link.isExpired()) {
    throw new CustomError('Link expired', 403);
  }

  // const server = await Server.findOne(link.serverId);
  const server = await getServerData(`${link.serverId}`);
  if (!server) {
    throw new CustomError('No server found', 404);
  }
  return server;
};

const isTokensValidForSocket = async (tokens: { accessToken: string, refreshToken: string }) => {
  const { accessToken: bearerAccessToken, refreshToken } = tokens;

  if (bearerAccessToken) {
    const [, accessToken] = bearerAccessToken.split(' ');

    try {
      const { userId } = await verfifyToken(accessToken);
      return [true, userId];
    } catch (err) {
      console.log('Access token verification error in socket', err);
    }
  }

  // error in verifying access token, verify refresh token below
  if (refreshToken) {
    try {
      const { userId } = await verfifyToken(refreshToken, false);
      return [true, userId];
    } catch (err) {
      console.log('Refresh token verification error in socket', err);
    }
  }
  return [false];
};

const getMessageType = (type: string): [MessageTypeEnum, string] => {
  if (type.match('audio.*')) return [MessageTypeEnum.AUDIO, 'video'];
  if (type.match('image.*')) return [MessageTypeEnum.IMAGE, 'image'];
  if (type.match('video.*')) return [MessageTypeEnum.VIDEO, 'video'];

  // for now return file
  return [MessageTypeEnum.FILE, 'auto'];
};

// if (originalName) return `${nanoid()}-${originalName}`;
const getFileName = (originalName: string) => `${originalName || nanoid()}`;

const calculateAspectRatioFit = (srcWidth: number, srcHeight: number, maxWidth = 400, maxHeight = 300) => {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

  return { width: Math.round(srcWidth * ratio), height: Math.round(srcHeight * ratio) };
};

type UpdateReturnType = (string | null)[];

const updateServerFile = async (
  newFileArr: Express.Multer.File[],
  serverObj: Server,
  fileColumnKey: 'banner' | 'avatar',
  isNewValueEmpty: boolean,
): Promise<UpdateReturnType> => {
  if (Array.isArray(newFileArr) && newFileArr[0]) {
    const [{ buffer: fileBuffer }] = newFileArr;
    const jpegBuffer = await sharp(fileBuffer)
      .jpeg({ mozjpeg: true, quality: 90 })
      .toBuffer();

    const base64String = `data:image/jpeg;base64,${jpegBuffer.toString('base64')}`;
    const fileResponse = await cloudinary.uploader.upload(
      base64String,
      { folder: 'discord_clone/api_uploads/server-files' },
    );
    const { secure_url: secureUrl, public_id: publicId } = fileResponse;
    return [secureUrl, publicId];
  }

  // if newFile was not present, and user sent empty value in body
  // for this key, so remove the already saved value from database
  const publicIdKey = `${fileColumnKey}PublicId`;
  return isNewValueEmpty
    ? [null, null]
    : [serverObj[fileColumnKey], serverObj[publicIdKey]];
};

const secondsToMillseconds = (seconds: number) => seconds * 1000;

// NOTE: just using this to prevent redis hitting max memory
// for my hosted plan, just small hack
const findAndDeleteTokensIfLimitExceeded = async (userId: string, newRefreshToken: string) => {
  const { uniqueCreationId: uniqueCreationIdOfLatestToken } = decodeJWT(newRefreshToken);

  const refreshTokensObj = await redisClient.hgetall(userId);
  const allRefreshTokensOfUser = Object.entries(refreshTokensObj);

  if (allRefreshTokensOfUser.length >= MAX_REFRESH_TOKENS_LIMIT_PER_USER) {
    let nonExpiredTokensCount = 0;
    const expiredTokens = [];
    const allTokensExceptTheLatest = [];

    allRefreshTokensOfUser.forEach(([refereshTokenUniqueKey, expiration]) => {
      const expInMs = secondsToMillseconds(parseInt(expiration, 10));

      if (new Date() < new Date(expInMs)) {
        // if not expired yet
        nonExpiredTokensCount += 1;
      } else expiredTokens.push(refereshTokenUniqueKey);

      if (refereshTokenUniqueKey !== uniqueCreationIdOfLatestToken) {
        allTokensExceptTheLatest.push(refereshTokenUniqueKey);
      }
    });

    if (nonExpiredTokensCount >= MAX_REFRESH_TOKENS_LIMIT_PER_USER) {
      // if non expired refresh tokens has length still greater than limit
      // delete all tokens except the latest one
      await redisClient.hdel(userId, ...allTokensExceptTheLatest);
    } else {
      redisClient.hdel(userId, ...expiredTokens);
    }
  }
};

export {
  createAccessToken,
  createRefreshToken,
  verfifyToken,
  decodeJWT,
  createLoginData,
  getServerForJoinLink,
  isTokensValidForSocket,
  getMessageType,
  getFileName,
  calculateAspectRatioFit,
  updateServerFile,
  secondsToMillseconds,
  findAndDeleteTokensIfLimitExceeded,
};
