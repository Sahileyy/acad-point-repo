import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
  facultyId: { type: String, required: true, unique: true },
  name: String,
  department: { type: String, required: true },
  email: { type: String, required: true, unique: true },  // ← add
  password: String,
  role: { type: String, default: "faculty" },
  status: { type: String, enum: ["Active", "Disabled"], default: "Active" },
  resetPasswordToken: String,       // ← add
  resetPasswordExpires: Date,       // ← add
});

export default mongoose.model("Faculty", facultySchema);
