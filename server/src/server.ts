import express from "express";
import mongoose from "mongoose";
import http from "http";
import { config } from "./config/config";
import Logging from "./library/logging";
//SoCket
import * as socket from 'socket.io'
import cors from "cors";
import SocketStart from "./socket/socket";
//Routes_API
import User_rount from "./routes/user";
import Room_rount from "./routes/Room";
import Message_rount from "./routes/message";
import QuestionAnswer_rount from "./routes/Qa";
import AI_rount from "./routes/AI";

const app = express();
const server = http.createServer(app);

app.use(cors());

mongoose.set("strictQuery", false);

mongoose
  .connect(config.mongo.url, { retryWrites: true, w: "majority" })
  .then(() => {
    Logging.info("Connect DB");
    StartServer();
  })
  .catch((err) => {
    Logging.error("Unable to coonect: ");
    Logging.error(err);
  });

const StartServer = () => {
  app.use((req, res, next) => {
    Logging.info(
      `Incooming -> Method: [${req.method}] - Url: [${req.url}] - IP: ${req.socket.remoteAddress}`
    );

    res.on("finish", () => {
      Logging.info(
        `Incooming -> Method: [${req.method}] - Url: [${req.url}] - IP: ${req.socket.remoteAddress} - Status: [${req.statusCode}]`
      );
    });
    next();
  });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method == "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "PUT, POST, PATCH, DELETE, GET"
      );
      return res.status(200).json({});
    }
    next();
  });

  app.use("/user", User_rount);
  app.use("/room", Room_rount);
  app.use("/dialog", Message_rount);
  app.use("/qa", QuestionAnswer_rount);
  app.use("/api", AI_rount);

  let io = new socket.Server(server, {
    cors: {
      origin: "http://localhost:8080",
      methods: ["GET", "POST"],
    },
  });

  SocketStart(io);

  server.listen(config.server.port, () => {
    Logging.info(`Server is running on port: ${config.server.port}`);
  });
};
