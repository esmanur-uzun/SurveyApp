import cron from "node-cron";
import Poll from "../models/Poll";
import APIError from "../../@utils/error";
import { Server } from "socket.io";

const deactivateExpiredPolls = (io: Server) => {
  cron.schedule("0 * * * *", async () => {
    try {
      const currentDate = new Date();
      const expiredPolls = await Poll.find({
        expiresAt: { $lt: currentDate },
        isActive: true,
      });

      await Poll.updateMany(
        { expiresAt: { $lt: currentDate }, isActive: true },
        { $set: { isActive: false } }
      );

      expiredPolls.forEach((poll) => {
        io.to(poll.user.toString()).emit("poll:expired", {
          message: "Anketinizin süresi doldu.",
          pollId: poll._id,
        });
      });
    } catch (error) {
      console.log(error);
      throw new APIError("Expired polls deactivation failed!", 500);
    }
  });
};

export default deactivateExpiredPolls;
