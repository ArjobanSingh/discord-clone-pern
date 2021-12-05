import express from 'express';
import authRouter from './authRouter';
import userRouter from './userRouter';

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/user', userRouter);

export default apiRouter;
