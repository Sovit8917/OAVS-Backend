import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGODB_URI) throw new Error("Missing required environment variable: MONGODB_URI");

export const config = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI,
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5500",
  nodeEnv: process.env.NODE_ENV || "development"
};
