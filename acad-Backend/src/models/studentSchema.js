import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    registerNumber: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true },
    semester: { type: String, required: true },          // "Odd" or "Even"
    department: { type: String, default: "" },
    password: { type: String, required: true },
    role: { type: String, default: "student", immutable: true },

    // Activity points summary (auto-calculated from approved certificates)
    activityPoints: {
      groupI: { type: Number, default: 0 },   // max 40
      groupII: { type: Number, default: 0 },   // max 40
      groupIII: { type: Number, default: 0 },   // max 40
    },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
