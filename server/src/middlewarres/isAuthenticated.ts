import { NextFunction, Response } from 'express';
import CustomRequest from '../interfaces/CustomRequest';
import { CustomError } from '../utils/errors';
import { verfifyToken } from '../utils/helperFunctions';

const isAuthenticated = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const bearerAccessToken = req.header('access-token');

  if (!bearerAccessToken) {
    next(new CustomError('Not authorized', 401));
    return;
  }
  const [, accessToken] = bearerAccessToken.split(' ');
  if (!accessToken) {
    next(new CustomError('Not authorized', 401));
    return;
  }

  try {
    const { userId } = await verfifyToken(accessToken);
    req.userId = userId;
    next();
  } catch (err) {
    const errorMessage = err.name === 'TokenExpiredError'
      ? 'Session expired, Please log in again'
      : 'Not authorized';
    next(new CustomError(errorMessage, 401));
  }
};

export default isAuthenticated;
