import express from "express";
import JWT from "../middlewares/auth.middleware";
import VoteController from "../app/controllers/VoteController";
import { Server } from "socket.io";

const router = express.Router();

export default (io: Server) => {
  const voteController = new VoteController(io);

  router.post("/save", JWT.verifyToken, voteController.saveVote);
  router.get("/poll/:id", JWT.verifyToken, voteController.getById);

  return router;
};
