import express from 'express';
import { getCurrentUser, updateUserDetails } from '../controllers/userController';
import { uploadUserProfilePic } from '../middlewarres/fileUpload';
import isAuthenticated from '../middlewarres/isAuthenticated';

const userRouter = express.Router();

userRouter.get('/', isAuthenticated, getCurrentUser);
userRouter.patch('/', isAuthenticated, uploadUserProfilePic, updateUserDetails);

export default userRouter;
