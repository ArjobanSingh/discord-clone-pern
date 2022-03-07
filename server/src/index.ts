import 'reflect-metadata';
import './config';

import { createConnection } from 'typeorm';
import { createServer } from 'http';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { Server as SocketIoServer } from 'socket.io';
import apiRouter from './routes';
import * as C from '../../common/socket-io-constants';
import { isTokensValidForSocket } from './utils/helperFunctions';

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app = express();
const httpServer = createServer(app);
const io = new SocketIoServer(httpServer, { cors: corsOptions });

const PORT = process.env.PORT || 5000;

interface CustomError {
  status?: number;
  message?: string;
  name?: string;
  error?: {
    [x: string]: string;
  };
}

createConnection()
  .then(async (connection) => {
    app.use(cors(corsOptions));
    app.use(express.json());

    // app.use(() => {
    //   const timeInMicroseconds = hrtime.bigint();
    //   console.log(timeInMicroseconds, Date.now(), new Date());
    // })
    app.use('/api', apiRouter);

    app.use(
      (err: CustomError, req: Request, res: Response, next: NextFunction) => {
        console.log('Main error', err);
        const status = err.status || 500;
        const { message = 'Something went wrong', error = { message } } = err;

        if (res.headersSent) {
          console.log('headers sent already');
          return next(err);
        }

        return res.status(status).json({
          error,
        });
      },
    );

    // if we want we can use userId to join room for personal notifications meant for user
    // or for private messaging in future
    io.use(async (socket, next) => {
      const { accessToken, refreshToken } = socket.handshake.auth;

      const isTokenValid = await isTokensValidForSocket({ accessToken, refreshToken });

      if (isTokenValid) {
        next();
        return;
      }

      next(new Error('Not authenticated'));
    });

    io.on('connection', (socket) => {
      console.log('New user connected: ', socket.id);

      socket.on(C.CONNECT_ALL_SERVERS, async (auth, data) => {
        const isTokenValid = await isTokensValidForSocket(auth);
        if (!isTokenValid) throw new Error('Not authenticated');

        socket.join(data);
        console.log('joined rooms', socket.rooms);
      });

      socket.on(C.CONNECT_SINGLE_SERVER, async (auth, serverId) => {
        const isTokenValid = await isTokensValidForSocket(auth);
        if (!isTokenValid) throw new Error('Not authenticated');

        socket.join(serverId);
        console.log('joined another new room', socket.rooms);
      });

      socket.on(C.DISCONNECT_SINGLE_SERVER, async (auth, serverId) => {
        const isTokenValid = await isTokensValidForSocket(auth);
        if (!isTokenValid) throw new Error('Not authenticated');

        socket.leave(serverId);
        console.log('Left room: ', socket.rooms);
      });

      socket.on(C.SEND_CHANNEL_MESSAGE, async (auth, messageContent, cb) => {
        const isTokenValid = await isTokensValidForSocket(auth);
        if (!isTokenValid) throw new Error('Not authenticated');

        const { serverId } = messageContent;
        cb(null, messageContent);
        socket.broadcast.to(serverId).emit(C.NEW_CHANNEL_MESSAGE, messageContent);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected: ', socket.id);
      });
    });

    httpServer.listen(PORT, () => `Listening on port ${PORT}`);
  })
  .catch((error) => console.log(error));
