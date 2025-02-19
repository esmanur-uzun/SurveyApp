import express from "express";
import { Server } from "socket.io";
import authRoute from "./auth.route";
import pollRoute from "./poll.route";
import voteRouter from "./vote.router";

const createRouter = (io: Server) => {
  const router = express.Router();
  router.use("/auth", authRoute);
  router.use("/poll", pollRoute(io));
  router.use("/vote", voteRouter(io));
  return router;
};

export default createRouter;
