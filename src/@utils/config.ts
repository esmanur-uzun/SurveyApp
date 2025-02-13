import dotenv from "dotenv";

dotenv.config();
export const config = {
  port: process.env.PORT,
  database_url: process.env.DB_URL,
};
