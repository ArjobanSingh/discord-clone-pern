import { validate } from 'class-validator';
import { NextFunction, Response } from 'express';
import { Server as SocketServer } from 'socket.io';
import sharp from 'sharp';
import cloudinary from '../cloudinary';
import User from '../entity/User';
import CustomRequest from '../interfaces/CustomRequest';
import { createValidationError, CustomError } from '../utils/errors';
import { getUserData } from '../utils/typeormHelpers';
import { USER_DETAILS_UPDATED } from '../utils/socket-io-constants';
import AppDataSource from '../data-source';

export const getCurrentUser = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req;
    const [user] = await getUserData(userId);

    if (!user) {
      next(new CustomError('No user found', 404));
      return;
    }
    const { password: _, ...otherUserProps } = user;
    res.json(otherUserProps);
  } catch (err) {
    next(err);
  }
};

export const updateUserDetails = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { userId } = req;
    let user = await User.findOneBy({ id: userId });

    const {
      name,
      email,
      profilePicture,
    } = req.body;

    if (!user) {
      next(new CustomError('No user found', 404));
      return;
    }

    user.name = name;
    user.email = email;

    const { profilePicturePublicId: prevProfilePublicId } = user;

    if (req.file) {
      const { buffer } = req.file;
      const jpegBuffer = await sharp(buffer)
        .jpeg({ mozjpeg: true, quality: 90 })
        .toBuffer();

      const base64String = `data:image/jpeg;base64,${jpegBuffer.toString('base64')}`;
      const fileResponse = await cloudinary.uploader.upload(
        base64String,
        { folder: 'discord_clone/api_uploads/user-profile' },
      );

      const { secure_url: secureUrl, public_id: publicId } = fileResponse;
      user.profilePicture = secureUrl;
      user.profilePicturePublicId = publicId;
    } else if (!profilePicture) {
      // most probably user removed profilePicture, if already was present
      user.profilePicture = null;
      user.profilePicturePublicId = null;
    }

    const errors = await validate(user);

    if (errors.length) {
      next(createValidationError(errors));
      return;
    }

    const response = await AppDataSource.getRepository(User)
      .createQueryBuilder()
      .update({
        name,
        email,
        profilePicture: user.profilePicture,
        profilePicturePublicId: user.profilePicturePublicId,
      })
      .where({
        id: user.id,
      })
      .returning('*')
      .execute();

    [user] = response.raw;

    const responseObj = {
      id: user.id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
    };
    res.json(responseObj);

    const io: SocketServer = req.app.get('io');

    // after response has been sent, delete previous profile pic if present
    if (prevProfilePublicId !== user.profilePicturePublicId) {
      cloudinary.uploader.destroy(prevProfilePublicId);
    }
    io.to(user.id).emit(USER_DETAILS_UPDATED, responseObj);
  } catch (err) {
    next(err);
  }
};
