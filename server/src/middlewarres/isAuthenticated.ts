import { NextFunction, Response } from 'express';
import CustomRequest from '../interfaces/CustomRequest';
import { CustomError } from '../utils/errors';
import { verfifyToken } from '../utils/helperFunctions';

const isAuthenticated = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const bearerAccessToken = req.header('access-token');

  if (!bearerAccessToken) {
    return next(new CustomError('Not authorized', 401));
  }
  const [, accessToken] = bearerAccessToken.split('bearer');
  if (!accessToken) return next(new CustomError('Not authorized', 401));

  try {
    const { userId } = await verfifyToken(accessToken);
    req.userId = userId;
    next();
  } catch (err) {
    const errorMessage = err.name === 'TokenExpiredError'
      ? 'Session expired, Please log in again'
      : 'Not authorized';
    return next(new CustomError(errorMessage, 401));
  }
};

export default isAuthenticated;
