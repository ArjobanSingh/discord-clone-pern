import 'reflect-metadata';
import './config';

import { createConnection } from 'typeorm';
import { createServer } from 'http';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { Server as SocketIoServer } from 'socket.io';
import multer from 'multer';
import apiRouter from './routes';
import * as C from '../../common/socket-io-constants';
import { isTokensValidForSocket } from './utils/helperFunctions';
import isSocketAuthenticated from './middlewarres/isSocketAuthenticated';

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
    app.set('io', io);

    app.use(
      (err: CustomError, req: Request, res: Response, next: NextFunction) => {
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
    io.use(async (socket, next) => {
      const { accessToken, refreshToken } = socket.handshake.auth;

      const [isTokenValid, userId] = await isTokensValidForSocket({ accessToken, refreshToken });

      if (isTokenValid) {
        // make user join room of his/her userId
        socket.join(userId);
        next();
        return;
      }

      next(new Error('Not authenticated'));
    });

    io.on('connection', (socket) => {
      console.log('New user connected: ', socket.id);

      // socket.use((event, next) => {
      //   console.log('SOcket event in middleware: ', event);
      //   next();
      // });

      socket.on(C.CONNECT_ALL_SERVERS, isSocketAuthenticated((_userId: string, data: string[]) => {
        socket.join(data);
        console.log('joined rooms', socket.rooms);
      }));

      socket.on(C.CONNECT_SINGLE_SERVER, isSocketAuthenticated((_userId: string, serverId: string) => {
        socket.join(serverId);
        console.log('joined another new room', socket.rooms);
      }));

      socket.on(C.DISCONNECT_SINGLE_SERVER, isSocketAuthenticated((_userId: string, serverId: string) => {
        socket.leave(serverId);
        console.log('Left room: ', socket.rooms);
      }));

      socket.on('disconnect', () => {
        console.log('User disconnected: ', socket.id);
      });
    });

    httpServer.listen(PORT, () => `Listening on port ${PORT}`);
  })
  .catch((error) => console.log(error));
