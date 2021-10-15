import "reflect-metadata";
import "./config";

import { createConnection } from "typeorm";
import express, { Errback, NextFunction, Request, Response } from "express";
import cors from 'cors';
import apiRouter from "./routes";

const app = express();

const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

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

    app.use("/api", apiRouter);
  
    app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
      const status = err.status || 500;
      const { message = 'Something went wrong', error = { message } } = err;

      return res.status(status).json({
        error,
      });
    });
  
    app.listen(PORT, () => `Listening on port ${PORT}`);
  })
  .catch((error) => console.log(error));
