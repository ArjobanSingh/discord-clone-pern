import { NextFunction, Response } from 'express';
import CustomRequest from '../interfaces/CustomRequest';
import { CustomError } from '../utils/errors';
import { createUserObject } from '../utils/helperFunctions';
import { getUserData } from '../utils/typeormHelpers';

export const getCurrentUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req;
    const [user] = await getUserData(userId);

    if (!user) {
      next(new CustomError('No user found', 404));
      return;
    }
    res.json(createUserObject(user, user.servers));
  } catch (err) {
    next(err);
  }
};

export const getUserById = (req: CustomRequest, res: Response) => {};
