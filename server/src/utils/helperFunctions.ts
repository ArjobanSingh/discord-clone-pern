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

const jwt = require('jsonwebtoken');

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
  // console.log('isAccessToken', isAccessToken, 'payload', payload);
  return payload;
};

const decodeJWT = (token: string) => jwt.decode(token);

const createLoginData = async (userId: string): Promise<LoginDataType> => {
  const accessToken = createAccessToken(userId);
  const refreshToken = createRefreshToken(userId);

  const { exp, uniqueCreationId } = decodeJWT(refreshToken);

  // save refresh token's uniqueCreationId in redis for this user, as it will unique
  // and we would not need to store whole refresh token in redis
  redisClient.hset(userId, uniqueCreationId, exp);
  await redisClient.expireat(userId, exp);

  return { accessToken, refreshToken };
};

const getServerForJoinLink = async (inviteLink: string): Promise<Server> => {
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

  const server = await Server.findOne(link.serverId);
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
};
