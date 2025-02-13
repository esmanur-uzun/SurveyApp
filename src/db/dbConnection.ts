import mongoose from "mongoose";
import { config } from "../@utils/config";

const dbConnection = async () => {
  try {
    await mongoose.connect(config.database_url as string);
    console.log("MongoDB connection successful");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default dbConnection;
