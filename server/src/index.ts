import "reflect-metadata";
import "./config";

import { createConnection } from "typeorm";
import express from "express";
import cors from 'cors';

const app = express();

const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

createConnection()
  .then(async (connection) => {
    app.use(cors(corsOptions));
    app.use(express.json());

    app.use((error, req, res, next) => {
      console.log("error", error, error.message, error.name);
      res.status(500).json({
        error,
      });
    });
  
    app.listen(PORT, () => `Listening on port ${PORT}`);
  })
  .catch((error) => console.log(error));
