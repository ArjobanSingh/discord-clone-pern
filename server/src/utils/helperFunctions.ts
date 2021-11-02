import LoginDataType from '../interfaces/LoginData';
import UserType from '../interfaces/User';
import redisClient from '../redisConfig';

const jwt = require('jsonwebtoken');

const {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
} = process.env;

const createUserObject = (user: UserType) => {
  const {
    email, name, status, profile_picture: profilePicture, id,
  } = user;
  return {
    id,
    email,
    name,
    status,
    profilePicture,
  };
};

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
  jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION })
);

const verfifyToken = async (token: string, isAccessToken = true): Promise<any> => {
  const secret = isAccessToken ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;
  const payload = await verifyWithPromise(token, secret);
  console.log('payload', payload);
  return payload;
};

const decodeJWT = (token: string) => jwt.decode(token);

const getSlicedTokenForRedis = (token: string) => token.slice(-43);

const createLoginData = async (userId: string): Promise<LoginDataType> => {
  const accessToken = createAccessToken(userId);
  const refreshToken = createRefreshToken(userId);

  const { exp } = decodeJWT(refreshToken);

  const tokenField = refreshToken;
  // save refresh token in redis for this user,
  // so that it can be expired on logout
  redisClient.hset(userId, tokenField, exp);
  await redisClient.expireat(userId, exp);

  return { accessToken, refreshToken };
};

export {
  createUserObject,
  createAccessToken,
  createRefreshToken,
  verfifyToken,
  decodeJWT,
  createLoginData,
  getSlicedTokenForRedis,
};
