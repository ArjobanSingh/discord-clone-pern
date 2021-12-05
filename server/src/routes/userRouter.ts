import express from 'express';
import { getCurrentUser } from '../controllers/userController';
import isAuthenticated from '../middlewarres/isAuthenticated';

const userRouter = express.Router();

userRouter.get('/', isAuthenticated, getCurrentUser);

export default userRouter;
