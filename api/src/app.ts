import express from "express";
import { Server } from "socket.io";
import http from "http";
import { config } from "./@utils/config";
import dbConnection from "./db/dbConnection";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import routers from "./routes";
import deactivateExpiredPolls from "./app/cron/pollCron";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// middleware for reading req body json
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

app.use("/api", routers(io));

app.use(errorHandlerMiddleware);

io.on("connection", (socket) => {
  console.log("bir kullanıcı bağlandı", socket.id);
});

dbConnection()
  .then(() => {
    deactivateExpiredPolls(io);
    server.listen(config.port, () => {
      console.log(
        `Express server is listening at http://localhost:${config.port}`
      );
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
