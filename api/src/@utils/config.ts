import dotenv from "dotenv";

dotenv.config();
export const config = {
  port: process.env.PORT || 5001,
  database_url: process.env.DB_URL,
  jwt_access_secret: process.env.JWT_SECRET_KEY,
  jwt_expires_in: process.env.JWT_EXPIRES_IN,
};
