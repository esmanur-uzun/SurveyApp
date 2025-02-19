import express from "express";
import JWT from "../middlewares/auth.middleware";
import PollController from "../app/controllers/PollController";
import { Server } from "socket.io";

const router = express.Router();

export default (io: Server) => {
  const pollController = new PollController(io);

  router.post("/create-poll", JWT.verifyToken, pollController.createPoll);
  router.get("/", JWT.verifyToken, pollController.getAll);
  router.get("/:id", JWT.verifyToken, pollController.getById);
  router.delete("/delete/:id", JWT.verifyToken, pollController.deletePoll);
  router.patch("/update/:id", JWT.verifyToken, pollController.updatePoll);
  return router;
};
