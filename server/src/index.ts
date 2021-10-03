import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";

const app = express();

const PORT = process.env.PORT || 5000;
createConnection()
  .then(async (connection) => {
    app.use(express.json());
    app.listen(PORT, () => `Listening on port ${PORT}`);
  })
  .catch((error) => console.log(error));
