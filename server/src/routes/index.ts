import express from 'express';
import authRouter from './authRouter';
import inviteRouter from './inviteRouter';
import serverRouter from './serverRouter';
import userRouter from './userRouter';

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/user', userRouter);
apiRouter.use('/server', serverRouter);
apiRouter.use('/invite', inviteRouter);

export default apiRouter;
