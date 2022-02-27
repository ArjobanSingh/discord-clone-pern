import { nanoid } from 'nanoid';
import InviteLink from '../entity/InviteLink';
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
      await verfifyToken(accessToken);
      return true;
    } catch (err) {
      console.log('Access token verification error in socket', err);
    }
  }

  // error in verifying access token, verify refresh token below
  if (refreshToken) {
    try {
      await verfifyToken(refreshToken, false);
      return true;
    } catch (err) {
      console.log('Refresh token verification error in socket', err);
    }
  }
  return false;
};

export {
  createAccessToken,
  createRefreshToken,
  verfifyToken,
  decodeJWT,
  createLoginData,
  getServerForJoinLink,
  isTokensValidForSocket,
};
