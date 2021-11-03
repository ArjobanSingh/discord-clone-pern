import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../entity/User';
import { createValidationError, createValidationErrorObject, CustomError } from '../utils/errors';
import {
  createAccessToken,
  createLoginData,
  createUserObject,
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

    const { accessToken, refreshToken } = await createLoginData(user.id);

    res.status(201).json({ user: createUserObject(user), accessToken, refreshToken });
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

    const user = await User.findOne({ email });
    if (!user) {
      next(new CustomError('No user found', 401));
      return;
    }

    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      next(new CustomError('Invalid credentials', 401));
      return;
    }
    const { accessToken, refreshToken } = await createLoginData(user.id);

    // TODO: add logic for lot of login redis sessions

    res.json({ user: createUserObject(user), accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};
export const logout = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { userId, uniqueCreationId } = req;
    await redisClient.hdel(userId, uniqueCreationId);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    // validate refresh token with redis
    const refresh = req.header('refresh-token');
    const { userId, uniqueCreationId } = req;
    const refreshTokenInRedis = await redisClient.hget(userId, uniqueCreationId);
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
