import { NextFunction, Response } from 'express';
import CustomRequest from '../interfaces/CustomRequest';
import redisClient from '../redisConfig';
import { CustomError } from '../utils/errors';
import { decodeJWT, verfifyToken } from '../utils/helperFunctions';

const isValidRefreshToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const refreshToken = req.header('refresh-token');

  if (!refreshToken) return next(new CustomError('Not authorized', 401));

  try {
    const { userId, uniqueCreationId } = await verfifyToken(refreshToken, false);
    req.userId = userId;
    req.uniqueCreationId = uniqueCreationId;
    next();
  } catch (err) {
    const isTokenExpired = err.name === 'TokenExpiredError';
    if (isTokenExpired) {
      // delete expired token from valid tokens
      const { userId, uniqueCreationId } = decodeJWT(refreshToken);
      await redisClient.hdel(userId, uniqueCreationId);
    }
    const errorMessage = isTokenExpired
      ? 'Session expired, Please log in again'
      : 'Not authorized';
    next(new CustomError(errorMessage, 401));
  }
};

export default isValidRefreshToken;
