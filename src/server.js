import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "./config.js";
import router from "./routes.js";

const app = express();
app.use(helmet());

// Flexible CORS: automatically allows requests from Vercel, localhost, and other clients
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "2mb" }));
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: "draft-7", legacyHeaders: false }));

app.get("/", (_req, res) => res.json({ status: "ok", service: "OAVS Study Hub API" }));
app.use("/api", router);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: config.nodeEnv === "production" ? "Internal server error." : err.message });
});

app.listen(config.port, () => console.log(`OAVS API running on port ${config.port}`));

try {
  await mongoose.connect(config.mongoUri);
  console.log("Connected to MongoDB Atlas");
} catch (err) {
  console.error("MongoDB Atlas connection error:", err.message);
}
