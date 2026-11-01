import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
  section: { type: String, required: true },
  topic: { type: String, required: true },
  status: { type: String, enum: ["Not Started", "Learning", "Practiced", "Revised", "Completed"], default: "Not Started" },
  confidence: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  note: { type: String, default: "", maxlength: 3000 }
}, { _id: false });

const logSchema = new mongoose.Schema({
  date: { type: String, required: true },
  subject: { type: String, required: true },
  minutes: { type: Number, required: true, min: 1, max: 1440 },
  topic: { type: String, default: "" },
  note: { type: String, default: "" }
}, { _id: true });

const revisionSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  date: { type: String, required: true },
  round: { type: String, default: "First revision" },
  note: { type: String, default: "" }
}, { _id: true });

const pyqSchema = new mongoose.Schema({
  year: { type: String, required: true },
  topic: { type: String, required: true },
  count: { type: Number, default: 1, min: 1 },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
  kind: { type: String, enum: ["Verified PYQ", "Repeated concept", "Expected practice"], default: "Verified PYQ" },
  notes: { type: String, default: "" }
}, { _id: true });

const mockSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  correct: { type: Number, required: true, min: 0, max: 200 },
  wrong: { type: Number, required: true, min: 0, max: 200 },
  blank: { type: Number, required: true, min: 0, max: 200 },
  time: { type: Number, required: true, min: 1, max: 200 },
  score: { type: Number, required: true }
}, { _id: true });


const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  subject: { type: String, default: "Computer Science" },
  duration: { type: Number, default: 30, min: 1, max: 1440 },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  completed: { type: Boolean, default: false },
  note: { type: String, default: "" }
}, { _id: true });

const studyDataSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
  topics: { type: [topicSchema], default: [] },
  logs: { type: [logSchema], default: [] },
  revisions: { type: [revisionSchema], default: [] },
  pyqs: { type: [pyqSchema], default: [] },
  mocks: { type: [mockSchema], default: [] },
  tasks: { type: [taskSchema], default: [] }
}, { timestamps: true });

export default mongoose.model("StudyData", studyDataSchema);