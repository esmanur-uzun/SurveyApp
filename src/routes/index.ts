import express from "express";
import { Server } from "socket.io";
import authRoute from "./auth.route";
import pollRoute from "./poll.route";

const createRouter = (io: Server) => {
  const router = express.Router();
  router.use("/auth", authRoute);
  router.use("/poll", pollRoute(io));
  return router;
};

export default createRouter;
