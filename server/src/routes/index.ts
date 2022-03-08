import express from 'express';
import authRouter from './authRouter';
import channelRouter from './channelRouter';
import inviteRouter from './inviteRouter';
import serverRouter from './serverRouter';
import userRouter from './userRouter';

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/server', serverRouter);
apiRouter.use('/invite', inviteRouter);
apiRouter.use('/channel', channelRouter);

export default apiRouter;
