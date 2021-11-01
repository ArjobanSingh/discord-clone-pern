import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import User from '../entity/User';
import { createValidationError, createValidationErrorObject, CustomError } from '../utils/errors';
import {
  createAccessToken,
  createRefreshToken,
  createUserObject,
  decodeJWT,
} from '../utils/helperFunctions';
import redisClient from '../redisConfig';
import CustomRequest from '../interfaces/CustomRequest';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = new User();
    const { email, name, password } = req.body;

    Object.entries({ email, name, password }).forEach(([key, value]) => {
      user[key] = value;
    });

    const errors = await validate(user);
    if (!password?.trim().length || password.trim().length <= 3) {
      errors.push(createValidationErrorObject('password', 'Password should be greater than 3 characters'));
    }

    if (errors.length) {
      next(createValidationError(errors));
      return;
    }

    await user.hashPassword();

    await user.save();

    const accessToken = createAccessToken(user.id);
    const refreshToken = createRefreshToken(user.id);

    const { exp } = decodeJWT(refreshToken);

    // save refresh token in redis for this user,
    // so that it can be expired on logout
    redisClient.hset(user.id, refreshToken, exp);
    await redisClient.expireat(user.id, exp);

    res.status(201).json({ user: createUserObject(user), accessToken, refreshToken });
  } catch (err) {
    console.log('err', err.code, err.name);
    if (err.name === 'QueryFailedError' && err.code === '23505') {
      next(new CustomError('User with same email already exists', 400));
      return;
    }
    next(err);
  }
};

export const login = () => {};
export const logout = () => {};

export const refreshToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    // validate refresh token with redis
    const refresh = req.header('refresh-token');
    const { userId } = req;
    const refreshTokenInRedis = await redisClient.hget(userId, refresh);
    if (!refreshTokenInRedis) {
      next(new CustomError('Session expired, Please log in again', 401));
      return;
    }
    const accessToken = createAccessToken(userId);
    res.json({ accessToken, refreshToken: refresh });
  } catch (err) {
    console.log('err', err);
    next(err);
  }
};
