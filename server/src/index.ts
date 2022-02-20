import 'reflect-metadata';
import './config';

import { createConnection } from 'typeorm';
import { createServer } from 'http';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { Server as SocketIoServer } from 'socket.io';
import apiRouter from './routes';

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

    io.on('connection', (socket) => {
      console.log('Socket', socket);
    });

    httpServer.listen(PORT, () => `Listening on port ${PORT}`);
  })
  .catch((error) => console.log(error));
