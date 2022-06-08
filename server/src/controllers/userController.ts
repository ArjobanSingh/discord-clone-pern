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
    const user = await User.findOne(userId);

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
    }

    const errors = await validate(user);

    if (errors.length) {
      next(createValidationError(errors));
      return;
    }

    await user.save();

    const responseObj = {
      id: user.id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
    };
    res.json(responseObj);

    const io: SocketServer = req.app.get('io');

    // after response has been sent, delete previous avatar/banner if present
    if (prevProfilePublicId !== user.profilePicturePublicId) {
      cloudinary.uploader.destroy(prevProfilePublicId);
    }
    io.emit(USER_DETAILS_UPDATED, responseObj);
  } catch (err) {
    next(err);
  }
};
