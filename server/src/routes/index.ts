import express from 'express';
import authRouter from './authRouter';
import serverRouter from './serverRouter';
import userRouter from './userRouter';

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/server', serverRouter);

export default apiRouter;
