import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../entity/User';
import { createValidationError, createValidationErrorObject, CustomError } from '../utils/errors';
import {
  createAccessToken,
  createLoginData,
  findAndDeleteTokensIfLimitExceeded,
} from '../utils/helperFunctions';
import redisClient from '../redisConfig';
import CustomRequest from '../interfaces/CustomRequest';
import { getUserData } from '../utils/typeormHelpers';

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

    const { accessToken, refreshToken } = await createLoginData(user.id);
    const {
      id, status, profilePicture,
    } = user;

    res.status(201).json({
      user: {
        id,
        email: user.email,
        name: user.name,
        status,
        profilePicture,
        servers: [],
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    if (err.name === 'QueryFailedError' && err.code === '23505') {
      next(new CustomError('User with same email already exists', 400));
      return;
    }
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const errors = [];
    if (!email?.trim().length) {
      errors.push(createValidationErrorObject('email', 'Please provide email'));
    }
    if (!password?.trim().length) {
      errors.push(createValidationErrorObject('password', 'Password cannot be empty'));
    }

    if (errors.length) {
      next(createValidationError(errors));
      return;
    }

    const [user] = await getUserData(undefined, email);
    if (!user) {
      next(new CustomError('No user found', 404));
      return;
    }

    const { password: hashedPassword, ...otherUserProps } = user;

    const result = await bcrypt.compare(password, hashedPassword);

    if (!result) {
      next(new CustomError('Invalid credentials', 401));
      return;
    }

    const { accessToken, refreshToken } = await createLoginData(user.id);

    res.json({ user: otherUserProps, accessToken, refreshToken });

    findAndDeleteTokensIfLimitExceeded(user.id, refreshToken);
  } catch (err) {
    next(err);
  }
};
export const logout = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, uniqueCreationId } = req;
    // console.time('redis delete');
    await redisClient.hdel(userId, uniqueCreationId);
    // console.timeEnd('redis delete');
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    // validate refresh token with redis
    const refresh = req.header('refresh-token');
    const { userId, uniqueCreationId } = req;
    // console.time('redis hget');
    const refreshTokenInRedis = await redisClient.hget(userId, uniqueCreationId);
    // console.timeEnd('redis hget');
    if (!refreshTokenInRedis) {
      next(new CustomError('Session expired, Please log in again', 401));
      return;
    }
    const accessToken = createAccessToken(userId);
    res.json({ accessToken, refreshToken: refresh });
  } catch (err) {
    next(err);
  }
};
