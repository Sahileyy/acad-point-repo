import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import studentRoutes from "./src/routes/studentRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import certificateRoutes from "./src/routes/certificateRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* ================== MIDDLEWARE ================== */
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    credentials: true
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================== ROUTES ================== */
app.use("/students", studentRoutes);
app.use("/auth", authRoutes);
app.use("/certificates", certificateRoutes);
app.use("/users", userRoutes);

/* ================== DATABASE ================== */
mongoose
  .connect("mongodb://127.0.0.1:27017/acad-point")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

/* ================== SERVER ================== */
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
