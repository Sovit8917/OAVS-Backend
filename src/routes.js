import express from "express";
import StudyData from "./models/StudyData.js";
import { ensureSyllabus } from "./seed.js";

const router = express.Router();

// Single-user, no-login mode: one shared study document in this MongoDB database.
// Keep this API private or restrict it at the hosting/network layer before public deployment.
const SINGLE_USER_ID = "000000000000000000000001";

router.get("/data", async (_req, res) => {
  const data = await ensureSyllabus(SINGLE_USER_ID);
  res.json({ data });
});

router.put("/data", async (req, res) => {
  const allowed = ["topics", "logs", "revisions", "pyqs", "mocks", "tasks", "schedules"];
  const update = {};
  for (const key of allowed) if (req.body && Object.hasOwn(req.body, key)) update[key] = req.body[key];
  const data = await StudyData.findOneAndUpdate(
    { user: SINGLE_USER_ID },
    { $set: update },
    { new: true, runValidators: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.json({ data });
});

router.post("/data/:collection", async (req, res) => {
  const allowed = ["logs", "revisions", "pyqs", "mocks", "tasks", "schedules"];
  const { collection } = req.params;
  if (!allowed.includes(collection)) return res.status(404).json({ message: "Unknown data collection." });
  const data = await ensureSyllabus(SINGLE_USER_ID);
  data[collection].push(req.body);
  await data.save();
  res.status(201).json({ item: data[collection][data[collection].length - 1], data });
});

router.delete("/data/:collection/:itemId", async (req, res) => {
  const allowed = ["logs", "revisions", "pyqs", "mocks", "tasks", "schedules"];
  const { collection, itemId } = req.params;
  if (!allowed.includes(collection)) return res.status(404).json({ message: "Unknown data collection." });
  const data = await ensureSyllabus(SINGLE_USER_ID);
  const item = data[collection].id(itemId);
  if (!item) return res.status(404).json({ message: "Record not found." });
  item.deleteOne();
  await data.save();
  res.json({ message: "Record deleted." });
});

router.get("/health", (_req, res) => res.json({ status: "ok", service: "OAVS Study Hub API" }));

export default router;
