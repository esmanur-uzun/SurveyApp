import express from "express";
import JWT from "../middlewares/auth.middleware";
import PollController from "../app/controllers/PollController";
import { Server } from "socket.io";

const router = express.Router();

export default (io: Server) => {
  const pollController = new PollController(io);

  router.post("/create-poll", JWT.verifyToken, pollController.CreatePoll);

  return router;
};
