import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    department: { type: String, required: true },
    institution: { type: String, required: true },
    role: { type: String, default: "admin", immutable: true },
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);
