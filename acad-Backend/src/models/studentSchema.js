import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  registerNumber: { type: String, required: true, unique: true },
  name: String,
  semester: Number,
  password: String,
  role: { type: String, default: "student" }
});

export default mongoose.model("Student", studentSchema);
