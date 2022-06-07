import 'reflect-metadata';
import './config';
import './cloudinary';

import { createConnection } from 'typeorm';
import { createServer } from 'http';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { Server as SocketIoServer, Socket } from 'socket.io';
import multer from 'multer';
import apiRouter from './routes';
import * as C from '../../common/socket-io-constants';
import { isTokensValidForSocket } from './utils/helperFunctions';
import ISocket from './types/ISocket';
import { CustomError } from './utils/errors';
import extractAuth from './middlewarres/extractAuth';

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app = express();
const httpServer = createServer(app);
const io = new SocketIoServer(httpServer, { cors: corsOptions });

const PORT = process.env.PORT || 5000;

interface ICustomError {
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
    //   const timeInMicroseconds = hrtime.bigint();

    app.use('/api', apiRouter);
    app.set('io', io);

    app.use(
      (err: ICustomError, req: Request, res: Response, next: NextFunction) => {
        console.log('Main error', err);
        let status = err.status || 500;

        let { message = 'Something went wrong' } = err;

        if (err instanceof multer.MulterError) {
          status = 418;
          if (err.code === 'LIMIT_FILE_SIZE') message = 'File is Too large, Maximum file size supported is 3mb';
        }

        if (res.headersSent) {
          console.log('headers sent already');
          return next(err);
        }

        return res.status(status).json({
          error: err.error ?? { message },
        });
      },
    );

    // if we want we can use userId to join room for personal notifications meant for user
    // or for private messaging in future
    io.use(async (socket: ISocket, next) => {
      const { accessToken, refreshToken } = socket.handshake.auth;

      const [isTokenValid, userId] = await isTokensValidForSocket({ accessToken, refreshToken });

      if (isTokenValid) {
        // eslint-disable-next-line no-param-reassign
        socket.userId = userId;

        // make user join room of his/her userId
        socket.join(userId);
        next();
        return;
      }

      const error = new CustomError('Session Expired', 401);
      error.data = { status: 401 };
      console.log('Auth Error in Socket Global IO middleware');
      next(error);
    });

    io.on('connection', (socket) => {
      console.log('New user connected: ', socket.id);

      socket.use(async (event, next) => {
        const [_eventKey, auth] = event;
        const { accessToken, refreshToken } = auth || {};
        const [isTokenValid] = await isTokensValidForSocket({ accessToken, refreshToken });

        if (isTokenValid) {
          next();
          return;
        }
        console.log('Auth Error in Socket middleware');
        socket.emit(C.SESSION_EXPIRED);
        next(new CustomError('Session Expired', 401));
      });

      socket.on(C.CONNECT_ALL_SERVERS, extractAuth((data: string[]) => {
        socket.join(data);
      }));

      socket.on(C.CONNECT_SINGLE_SERVER, extractAuth((serverId: string) => {
        socket.join(serverId);
      }));

      socket.on(C.DISCONNECT_SINGLE_SERVER, extractAuth((serverId: string) => {
        socket.leave(serverId);
      }));

      // socket.on(C.CONNECT_ALL_SERVERS, isSocketAuthenticated((_userId: string, data: string[]) => {
      //   socket.join(data);
      // }));

      socket.on('disconnect', () => {
        console.log('User disconnected: ', socket.id);
      });
    });

    httpServer.listen(PORT, () => `Listening on port ${PORT}`);
  })
  .catch((error) => {
    console.log('Global error', error);
  });
