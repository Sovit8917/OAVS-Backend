import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "./config.js";
import router from "./routes.js";

const app = express();
app.use(helmet());
app.use(cors({ origin: config.clientOrigin.split(",").map(x => x.trim()), credentials: false }));
app.use(express.json({ limit: "2mb" }));
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: "draft-7", legacyHeaders: false }));
app.use("/api", router);
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: config.nodeEnv === "production" ? "Internal server error." : err.message });
});

await mongoose.connect(config.mongoUri);
console.log("Connected to MongoDB Atlas");
app.listen(config.port, () => console.log(`OAVS API running on http://localhost:${config.port}`));